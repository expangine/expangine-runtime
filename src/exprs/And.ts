
import { Expression, ExpressionProvider } from '../Expression';


const INDEX_EXPRESSIONS = 1;

export class AndExpression extends Expression 
{

  public static id = 'and';

  public static decode(data: any[], exprs: ExpressionProvider): AndExpression 
  {
    const expressions = data[INDEX_EXPRESSIONS].map((d: any) => exprs.getExpression(d));
    
    return new AndExpression(expressions);
  }

  public static encode(expr: AndExpression): any 
  {
    const expressions = expr.expressions.map(expr => expr.encode());

    return [this.id, expressions];
  }

  public expressions: Expression[];

  public constructor(expressions: Expression[]) 
  {
    super(AndExpression.id);
    this.expressions = expressions;
  }

  public encode(): any 
  {
    return AndExpression.encode(this);
  }

}