
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { isString, toExpr, objectEach } from '../fns';
import { AnyType } from '../types/Any';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';


const INDEX_DEFINE = 1;
const INDEX_BODY = 2;

export class DefineExpression extends Expression 
{

  public static id = 'def';

  public static decode(data: any[], exprs: ExpressionProvider): DefineExpression 
  {
    const define = data[INDEX_DEFINE].map(([name, d]: [string, any]) => [name, exprs.getExpression(d)]);
    const body = exprs.getExpression(data[INDEX_BODY]);
    
    return new DefineExpression(define, body);
  }

  public static encode(expr: DefineExpression): any 
  {
    const define = expr.define.map(([name, defined]) => [name, defined.encode()]);

    return [this.id, define, expr.body.encode()];
  }

  public define: [string, Expression][];
  public body: Expression;

  public constructor(define: [string, Expression][], body: Expression) 
  {
    super();
    this.define = define;
    this.body = body;
  }

  public getId(): string
  {
    return DefineExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return this.define.reduce((max, [name, e]) => Math.max(max, e.getComplexity(def)), this.body.getComplexity(def));
  }

  public getScope()
  {
    const scope = {};

    this.define.forEach(([name, defined]) => scope[name] = AnyType.baseType);

    return scope;
  }

  public encode(): any 
  {
    return DefineExpression.encode(this);
  }

  public getType(def: Definitions, original: Type): Type | null
  {
    const { scope, context } = def.getContextWithScope(original);

    this.define.forEach(([name, defined]) => scope[name] = defined.getType(def, context));

    return this.body.getType(def, context);
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step('define', () =>
        this.define.forEach(([name, defined]) => 
          traverse.step(name, defined)
        )
      );
      traverse.step('body', this.body);
    });
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.define.forEach(([name, defined]) => defined.setParent(this));
    this.body.setParent(this);
  }

  public with(name: string, value: ExpressionValue): DefineExpression
  public with(defines: Record<string, ExpressionValue>): DefineExpression
  public with(nameOrDefines: string | Record<string, ExpressionValue>, value?: Expression): DefineExpression
  {
    const define = this.define.slice();

    const append = isString(nameOrDefines)
      ? { [nameOrDefines]: value }
      : nameOrDefines;

    objectEach(append, (defined, name) => define.push([name, toExpr(defined)]));

    return new DefineExpression(define, this.body);
  }

  public run(expr: Expression): DefineExpression
  {
    return new DefineExpression(this.define.slice(), expr);
  }

}