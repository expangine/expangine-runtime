
import { isUndefined } from '../fns';
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';


const INDEX_VALUE = 1;
const INDEX_OP = 2;
const INDEX_CASES = 3;
const INDEX_DEFAULT_CASE = 4;

export class SwitchExpression extends Expression 
{

  public static id = 'switch';

  public static decode(data: any[], exprs: ExpressionProvider): SwitchExpression 
  {
    const value = exprs.getExpression(data[INDEX_VALUE]);
    const op = data[INDEX_OP];
    const cases = data[INDEX_CASES].map(([tests, result]: [any[], any]) => [
      tests.map((t: any) => exprs.getExpression(t)), 
      exprs.getExpression(result)
    ]);
    const defaultCase = exprs.getExpression(data[INDEX_DEFAULT_CASE]);

    return new SwitchExpression(value, op, cases, defaultCase);
  }

  public static encode(expr: SwitchExpression): any 
  {
    const value = expr.value.encode();
    const cases = expr.cases.map(([tests, result]) => [tests.map(t => t.encode()), result.encode()]);

    return isUndefined(expr.defaultCase)
      ? [this.id, value, expr.op, cases]
      : [this.id, value, expr.op, cases, expr.defaultCase.encode()];
  }

  public value: Expression;
  public op: string;
  public cases: [Expression[], Expression][];
  public defaultCase: Expression;

  public constructor(value: Expression, op: string, cases: [Expression[], Expression][], defaultCase: Expression) 
  {
    super(SwitchExpression.id);
    this.value = value;
    this.op = op;
    this.cases = cases;
    this.defaultCase = defaultCase;
  }

  public getComplexity(def: Definitions): number
  {
    return this.cases.reduce(
      (max, [tests, result]) => Math.max(
        max, 
        result.getComplexity(def), 
        tests.reduce((tmax, t) => Math.max(
          tmax, 
          t.getComplexity(def)
        ), 0)
      ), 
      Math.max(
        this.value.getComplexity(def), 
        this.defaultCase.getComplexity(def)
      )
    );
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return SwitchExpression.encode(this);
  }

}