
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';


const INDEX_EXPR = 1;

export class NotExpression extends Expression 
{

  public static id = 'not';

  public static decode(data: any[], exprs: ExpressionProvider): NotExpression 
  {
    const expression = exprs.getExpression(data[INDEX_EXPR]);
    
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

  public getComplexity(def: Definitions): number
  {
    return this.expression.getComplexity(def);
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