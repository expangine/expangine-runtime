
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';


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
    super(OrExpression.id);
    this.expressions = expressions;
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

}