
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';


const INDEX_EXPR = 1;

export class ReturnExpression extends Expression 
{

  public static id = 'return';

  public static decode(data: any[], exprs: ExpressionProvider): ReturnExpression 
  {
    const expression = exprs.getExpression(data[INDEX_EXPR]);
    
    return new ReturnExpression(expression);
  }

  public static encode(expr: ReturnExpression): any 
  {
    const returnValue = expr.expression.encode();

    return returnValue !== undefined
      ? [this.id, returnValue]
      : [this.id];
  }

  public expression: Expression;

  public constructor(expression: Expression) 
  {
    super();
    this.expression = expression;
  }

  public getId(): string
  {
    return ReturnExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return this.expression
      ? this.expression.getComplexity(def)
      : 0;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return ReturnExpression.encode(this);
  }

}