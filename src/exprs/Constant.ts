
import { isArray } from '../fns';
import { Expression, ExpressionProvider } from '../Expression';


const INDEX_CONSTANT = 1;

export class ConstantExpression extends Expression 
{

  public static has(e: Expression, constant: any): boolean
  {
    return e instanceof ConstantExpression && e.value === constant;
  }

  public static is(e: Expression): e is ConstantExpression
  {
    return e instanceof ConstantExpression;
  }

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
    super();
    this.value = value;
  }

  public getId(): string
  {
    return ConstantExpression.id;
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