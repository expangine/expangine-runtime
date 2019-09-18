
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';


export class NoExpression extends Expression 
{

  public static id = 'noop';

  public static readonly instance = new NoExpression();

  public static decode(data: any[], exprs: ExpressionProvider): NoExpression 
  {
    return this.instance
  }

  public static encode(expr: NoExpression): any 
  {
    return [this.id];
  }

  public getId(): string
  {
    return NoExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return 0;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return NoExpression.encode(this);
  }

}