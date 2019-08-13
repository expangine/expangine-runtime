
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { ConstantExpression } from './Constant';


const INDEX_CASES = 1;
const INDEX_OTHERWISE = 2;

export class IfExpression extends Expression 
{

  public static id = 'if';

  public static decode(data: any[], exprs: ExpressionProvider): IfExpression 
  {
    const cases = data[INDEX_CASES].map(([test, result]: [any, any]) => [exprs.getExpression(test), exprs.getExpression(result)]);
    const otherwise = exprs.getExpression(data[INDEX_OTHERWISE]);

    return new IfExpression(cases, otherwise);
  }

  public static encode(expr: IfExpression): any 
  {
    const cases = expr.cases.map(([test, result]) => [test.encode(), result.encode()]);

    return ConstantExpression.has(expr.otherwise, undefined)
      ? [this.id, cases]
      : [this.id, cases, expr.otherwise.encode()];
  }

  public cases: [Expression, Expression][];
  public otherwise: Expression;

  public constructor(cases: [Expression, Expression][], otherwise: Expression) 
  {
    super(IfExpression.id);
    this.cases = cases;
    this.otherwise = otherwise;
  }

  public getComplexity(def: Definitions): number
  {
    return this.cases.reduce(
      (max, [test, result]) => Math.max(
        max, 
        test.getComplexity(def),
        result.getComplexity(def)
      ), 
      this.otherwise.getComplexity(def)
    );
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return IfExpression.encode(this);
  }

}