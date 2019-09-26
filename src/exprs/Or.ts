
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { isArray } from '../fns';
import { AndExpression } from './And';
import { Type } from '../Type';
import { BooleanType } from '../types/Boolean';


const INDEX_EXPRESSIONS = 1;

export class OrExpression extends Expression 
{

  public static id = 'or';

  public static decode(data: any[], exprs: ExpressionProvider): OrExpression 
  {
    const expressions = data[INDEX_EXPRESSIONS].map((d: any) => exprs.getExpression(d));
    
    return new OrExpression(expressions);
  }

  public static encode(expr: OrExpression): any 
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
    return OrExpression.id;
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
    return OrExpression.encode(this);
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    const types: Type[] = this.expressions
      .map(e => e.getType(def, context))
      .concat(BooleanType.baseType)
      .filter(t => !!t)
    ;
    
    return def.mergeTypes(types);
  }

  public or(exprs: Expression | Expression[]): OrExpression
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new OrExpression(this.expressions.concat(append));
  }

  public and(exprs: Expression | Expression[]): AndExpression
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new AndExpression([this as Expression].concat(append));
  }

}