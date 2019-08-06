
import { Expression, ExpressionProvider } from '../Expression';


export class NotExpression extends Expression 
{

  public static id = 'not';

  public static decode(data: any[], exprs: ExpressionProvider): NotExpression 
  {
    const expression = exprs.getExpression(data[1]);
    
    return new NotExpression(expression);
  }

  public static encode(expr: NotExpression): any 
  {
    const expression = expr.expression.encode();

    return [this.id, expression];
  }

  public expression: Expression;

  public constructor(expression: Expression) 
  {
    super(NotExpression.id);
    this.expression = expression;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return NotExpression.encode(this);
  }

}