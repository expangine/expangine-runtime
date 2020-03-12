
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { ConstantExpression } from './Constant';
import { Operation } from '../Operation';
import { NoExpression } from './No';
import { isNumber } from '../fns';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { Types } from '../Types';
import { Exprs } from '../Exprs';
import { NullType } from '../types/Null';


const INDEX_VALUE = 1;
const INDEX_OP = 2;
const INDEX_CASES = 3;
const INDEX_DEFAULT_CASE = 4;

export class SwitchExpression extends Expression 
{

  public static STEP_VALUE = 'value';

  public static STEP_CASES = 'cases';

  public static STEP_CASE = 'case';

  public static STEP_RESULT = 'result';

  public static STEP_DEFAULT = 'default';

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

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return this.cases.reduce(
      (max, [tests, result]) => Math.max(
        max, 
        result.getComplexity(def, context), 
        tests.reduce((tmax, t) => Math.max(
          tmax, 
          t.getComplexity(def, context)
        ), 0)
      ), 
      Math.max(
        this.value.getComplexity(def, context), 
        this.defaultCase.getComplexity(def, context)
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

  public clone(): Expression
  {
    return new SwitchExpression(this.value.clone(), this.op, this.cases.map(([tests, then]) => [tests.map((t) => t.clone()), then.clone()]), this.defaultCase.clone());
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    const types = this.cases
      .map(([tests, value]) => value)
      .concat(this.defaultCase)
      .filter(e => !!e)
      .map(e => e.getType(def, context))
      .filter(t => !!t)
    ;

    return Types.mergeMany(types, NullType.baseType);
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(SwitchExpression.STEP_VALUE, this.value, (replaceWith) => this.value = replaceWith);
      traverse.step(SwitchExpression.STEP_CASES, () => 
        this.cases.forEach(([tests, result], caseIndex) =>
          traverse.step(caseIndex, () => {
            traverse.step(SwitchExpression.STEP_CASE, () => 
              tests.forEach((test, index) => 
                traverse.step(index, test, (replaceWith) => tests.splice(index, 1, replaceWith), () => tests.splice(index, 1))
              )
            );
            traverse.step(SwitchExpression.STEP_RESULT, result, (replaceWith) => this.cases[caseIndex].splice(1, 1, replaceWith));
          })  
        )
      );
      traverse.step(SwitchExpression.STEP_DEFAULT, this.defaultCase, (replaceWith) => this.defaultCase = replaceWith);
    });
  }

  // tslint:disable: no-magic-numbers
  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === SwitchExpression.STEP_VALUE
      ? [1, this.value]
      : steps[0] === SwitchExpression.STEP_CASES
        ? isNumber(steps[1]) && steps[1] < this.cases.length
          ? steps[2] === SwitchExpression.STEP_CASE
            ? isNumber(steps[3]) && steps[3] < this.cases[steps[1]][0].length
              ? [4, this.cases[steps[1]][0][steps[3]]]
              : null
            : steps[2] === SwitchExpression.STEP_RESULT
              ? [3, this.cases[steps[1]][1]]
              : null
            : null
        : steps[0] === SwitchExpression.STEP_DEFAULT
          ? [1, this.defaultCase]
          : null;
  }
  // tslint:enable: no-magic-numbers

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

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    this.value.validate(def, context, handler);

    this.cases.forEach(([tests, result]) => 
    {
      tests.forEach(e => e.validate(def, context, handler));

      result.validate(def, context, handler);
    });

    this.defaultCase.validate(def, context, handler);
  }

  public val(value: ExpressionValue, op?: Operation): SwitchExpression
  {
    this.value = Exprs.parse(value);
    this.value.setParent(this);
    this.op = op ? op.id : this.op;

    return this;
  }

  public case(testValue: ExpressionValue): SwitchExpression
  {
    const n = this.cases.length - 1;
    const test = Exprs.parse(testValue);

    test.setParent(this);

    if (n >= 0 && this.cases[n][1] === NoExpression.instance)
    {
      this.cases[n][0].push(test);
    }
    else
    {
      this.cases.push([[test], NoExpression.instance]);
    }

    return this;
  }

  public than(bodyValue: ExpressionValue): SwitchExpression
  {
    const body = Exprs.parse(bodyValue);

    this.cases[this.cases.length - 1][1] = body;
    body.setParent(this);

    return this;
  }

  public default(body: ExpressionValue)
  {
    this.defaultCase = Exprs.parse(body);
    this.defaultCase.setParent(this);

    return this;
  }

}