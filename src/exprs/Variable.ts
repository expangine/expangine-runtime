
import { Expression, ExpressionProvider } from '../Expression';


const INDEX_PATH = 1;

export class VariableExpression extends Expression 
{

  public static id = 'var';

  public static decode(data: any[], exprs: ExpressionProvider): VariableExpression 
  {
    const path: Expression[] = data[INDEX_PATH].map((part: any) => exprs.getExpression(part));

    return new VariableExpression(path);
  }

  public static encode(expr: VariableExpression): any 
  {
    const path = expr.path.map(e => e.encode());

    return [this.id, path];
  }

  public path: Expression[];

  public constructor(path: Expression[]) 
  {
    super(VariableExpression.id);
    this.path = path;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return VariableExpression.encode(this);
  }

}