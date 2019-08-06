
import { isArray } from '../fns';
import { Expression, ExpressionProvider } from '../Expression';


export class ConstantExpression extends Expression 
{

  public static id = 'constant';

  public static decode(data: any[], expr: ExpressionProvider): ConstantExpression 
  {
    return new ConstantExpression(data[1]);
  }

  public static encode(expr: ConstantExpression): any 
  {
    return isArray(expr.value)
      ? [this.id, expr.value]
      : expr.value;
  }

  public value: any;

  public constructor(value: any) 
  {
    super(ConstantExpression.id);
    this.value = value;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return ConstantExpression.encode(this);
  }

}