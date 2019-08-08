
import { isArray } from '../fns';
import { Expression, ExpressionProvider } from '../Expression';


const INDEX_CONSTANT = 1;

export class ConstantExpression extends Expression 
{

  public static id = 'constant';

  public static decode(data: any[], expr: ExpressionProvider): ConstantExpression 
  {
    return new ConstantExpression(data[INDEX_CONSTANT]);
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

  public getComplexity(): number
  {
    return 0;
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