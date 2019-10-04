
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { TupleType } from '../types/Tuple';


const INDEX_EXPRESSIONS = 1;

export class TupleExpression extends Expression 
{

  public static id = 'tuple';

  public static decode(data: any[], exprs: ExpressionProvider): TupleExpression 
  {
    const expressions = data[INDEX_EXPRESSIONS].map((d: any) => exprs.getExpression(d));
    
    return new TupleExpression(expressions);
  }

  public static encode(expr: TupleExpression): any 
  {
    const expressions = expr.expressions.map(e => e.encode());

    return [this.id, expressions];
  }

  public expressions: Expression[];

  public constructor(expressions: Expression[]) 
  {
    super();
    this.expressions = expressions;
  }

  public getId(): string
  {
    return TupleExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return this.expressions.reduce((max, e) => Math.max(max, e.getComplexity(def)), 0);
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return TupleExpression.encode(this);
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    return new TupleType(this.expressions.map((e) => Type.simplify(e.getType(def, context))));
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => 
      this.expressions.forEach((expr, index) => 
        traverse.step(index, expr)
      )
    );
  }

  public setParent(parent?: Expression): void
  {
    this.parent = parent;

    this.expressions.forEach(e => e.setParent(this));
  }

}