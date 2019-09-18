
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { ConstantExpression } from './Constant';
import { NoExpression } from './No';


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
    super();
    this.cases = cases;
    this.otherwise = otherwise;
  }

  public getId(): string
  {
    return IfExpression.id;
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

  public if(condition: Expression, body?: Expression)
  {
    const cases = this.cases.slice();
    cases.push([condition, body || NoExpression.instance]);

    return new IfExpression(cases, this.otherwise);
  }

  public then(body: Expression)
  {
    const cases = this.cases.slice();
    cases[cases.length - 1][1] = body;

    return new IfExpression(cases, this.otherwise);
  }

  public elseif(condition: Expression, body?: Expression)
  {
    const cases = this.cases.slice();
    cases.push([condition, body || NoExpression.instance]);

    return new IfExpression(cases, this.otherwise);
  }

  public else(body: Expression)
  {
    return new IfExpression(this.cases, body);
  }

}