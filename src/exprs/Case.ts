
import { isUndefined } from '../fns';
import { Expression, ExpressionProvider } from '../Expression';


const INDEX_CASES = 1;
const INDEX_OTHERWISE = 2;

export class CaseExpression extends Expression 
{

  public static id = 'case';

  public static decode(data: any[], exprs: ExpressionProvider): CaseExpression 
  {
    const cases = data[INDEX_CASES].map(([test, result]: [any, any]) => [exprs.getExpression(test), exprs.getExpression(result)]);
    const otherwise = exprs.getExpression(data[INDEX_OTHERWISE]);

    return new CaseExpression(cases, otherwise);
  }

  public static encode(expr: CaseExpression): any 
  {
    const cases = expr.cases.map(([test, result]) => [test.encode(), result.encode()]);

    return isUndefined(expr.otherwise)
      ? [this.id, cases]
      : [this.id, cases, expr.otherwise.encode()];
  }

  public cases: [Expression, Expression][];
  public otherwise: Expression;

  public constructor(cases: [Expression, Expression][], otherwise: Expression) 
  {
    super(CaseExpression.id);
    this.cases = cases;
    this.otherwise = otherwise;
  }

  public encode(): any 
  {
    return CaseExpression.encode(this);
  }

}