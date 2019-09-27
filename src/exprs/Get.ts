
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
import { toExpr, isArray } from '../fns';
import { Type } from '../Type';
import { Traverser } from '../Traverser';


const INDEX_PATH = 1;

export class GetExpression extends Expression 
{

  public static id = 'get';

  public static decode(data: any[], exprs: ExpressionProvider): GetExpression 
  {
    const path: Expression[] = data[INDEX_PATH].map((part: any) => exprs.getExpression(part));

    return new GetExpression(path);
  }

  public static encode(expr: GetExpression): any 
  {
    const path = expr.path.map(e => e.encode());

    return [this.id, path];
  }

  public static create(path: ExpressionValue[])
  {
    return new GetExpression(toExpr(path));
  }

  public path: Expression[];

  public constructor(path: Expression[]) 
  {
    super();
    this.path = path;
  }

  public getId(): string
  {
    return GetExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return this.path.reduce((max, e) => Math.max(max, e.getComplexity(def)), 0);
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return GetExpression.encode(this);
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    return def.getPathType(this.path, context);
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => 
      this.path.forEach((expr, index) => 
        traverse.step(index, expr)
      )
    );
  }

  public setParent(parent?: Expression): void
  {
    this.parent = parent;

    this.path.forEach(e => e.setParent(this));
  }

  public add(expr: ExpressionValue | ExpressionValue[]): GetExpression
  {
    const append = isArray(expr)
      ? expr
      : [expr];

    return new GetExpression(this.path.concat(toExpr(append)));
  }

}