
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
import { ConstantExpression } from './Constant';
import { Operation } from '../Operation';
import { NoExpression } from './No';
import { toExpr } from '../fns';
import { Type } from '../Type';
import { Traverser } from '../Traverser';


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

    return ConstantExpression.has(expr.defaultCase, undefined)
      ? [this.id, value, expr.op, cases]
      : [this.id, value, expr.op, cases, expr.defaultCase.encode()];
  }

  public value: Expression;
  public op: string;
  public cases: [Expression[], Expression][];
  public defaultCase: Expression;

  public constructor(value: Expression, op: string, cases: [Expression[], Expression][], defaultCase: Expression) 
  {
    super();
    this.value = value;
    this.op = op;
    this.cases = cases;
    this.defaultCase = defaultCase;
  }

  public getId(): string
  {
    return SwitchExpression.id;
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

  public getType(def: Definitions, context: Type): Type | null
  {
    const types = this.cases
      .map(([tests, value]) => value)
      .concat(this.defaultCase)
      .filter(e => !!e)
      .map(e => e.getType(def, context))
      .filter(t => !!t)
    ;

    return def.mergeTypes(types);
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step('value', this.value);
      traverse.step('cases', () => 
        this.cases.forEach(([tests, result], caseIndex) =>
          traverse.step(caseIndex, () => {
            traverse.step('case', () => 
              tests.forEach((test, index) => 
                traverse.step(index, test)
              )
            );
            traverse.step('result', result);
          })  
        )
      );
      if (this.defaultCase !== NoExpression.instance) {
        traverse.step('default', this.defaultCase);
      }
    });
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.value.setParent(this);
    this.cases.forEach(([tests, result]) => {
      tests.forEach(e => e.setParent(this));
      result.setParent(this);
    });
    this.defaultCase.setParent(this);
  }

  private copyCases(): Array<[Expression[], Expression]>
  {
    return this.cases.map(([a, b]) => [a.slice(), b]);
  }

  public val(value: ExpressionValue, op?: Operation): SwitchExpression
  {
    return new SwitchExpression(toExpr(value), op ? op.id : this.op, this.cases, this.defaultCase);
  }

  public case(test: ExpressionValue): SwitchExpression
  {
    const cases = this.copyCases();
    const n = cases.length - 1;

    if (n >= 0 && cases[n][1] === NoExpression.instance)
    {
      cases[n][0].push(toExpr(test));
    }
    else
    {
      cases.push([[toExpr(test)], NoExpression.instance]);
    }

    return new SwitchExpression(this.value, this.op, cases, this.defaultCase);
  }

  public than(body: ExpressionValue): SwitchExpression
  {
    const cases = this.copyCases();
    cases[cases.length - 1][1] = toExpr(body);
    
    return new SwitchExpression(this.value, this.op, cases, this.defaultCase);
  }

  public default(body: ExpressionValue)
  {
    return new SwitchExpression(this.value, this.op, this.cases, toExpr(body));
  }

}