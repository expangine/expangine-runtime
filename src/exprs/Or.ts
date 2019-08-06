
import { Expression, ExpressionProvider } from '../Expression';


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
    const expressions = expr.expressions.map(expr => expr.encode());

    return [this.id, expressions];
  }

  public expressions: Expression[];

  public constructor(expressions: Expression[]) 
  {
    super(OrExpression.id);
    this.expressions = expressions;
  }

  public encode(): any 
  {
    return OrExpression.encode(this);
  }

}