
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { ConstantExpression } from './Constant';
import { NoExpression } from './No';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { BooleanType } from '../types/Boolean';
import { isNumber } from '../fns';
import { Types } from '../Types';
import { NullType } from '../types/Null';


const INDEX_CASES = 1;
const INDEX_OTHERWISE = 2;

export class IfExpression extends Expression 
{

  public static STEP_CASES = 'cases';

  public static STEP_IF = 'if';

  public static STEP_THEN = 'then';

  public static STEP_ELSE = 'else';

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

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return this.cases.reduce(
      (max, [test, result]) => Math.max(
        max, 
        test.getComplexity(def, context),
        result.getComplexity(def, context)
      ), 
      this.otherwise.getComplexity(def, context)
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

  public clone(): Expression
  {
    return new IfExpression(this.cases.map(([condition, then]) => [condition.clone(), then.clone()]), this.otherwise.clone());
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    const types = this.cases
      .map(([test, value]) => value)
      .concat(this.otherwise)
      .filter(e => !!e)
      .map(e => e.getType(def, context))
      .filter(t => !!t)
    ;

    return Types.mergeMany(types, NullType.baseType);
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(IfExpression.STEP_CASES, () => 
        this.cases.forEach(([condition, result], index) => 
          traverse.step(index, () => {
            traverse.step(IfExpression.STEP_IF, condition, (replaceWith) => this.cases[index].splice(0, 1, replaceWith));
            traverse.step(IfExpression.STEP_THEN, result, (replaceWith) => this.cases[index].splice(1, 1, replaceWith));
          })
        )
      );
      if (this.otherwise !== NoExpression.instance) {
        traverse.step(IfExpression.STEP_ELSE, this.otherwise, (replaceWith) => this.otherwise = replaceWith);
      }
    });
  }

  // tslint:disable: no-magic-numbers
  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === IfExpression.STEP_CASES
      ? isNumber(steps[1]) && steps[1] < this.cases.length
        ? steps[2] === IfExpression.STEP_IF
          ? [3, this.cases[steps[1]][0]]
          : steps[2] === IfExpression.STEP_THEN
            ? [3, this.cases[steps[1]][1]]
            : null
        : null
      : steps[0] === IfExpression.STEP_ELSE
        ? [1, this.otherwise]
        : null;
  }
  // tslint:enable: no-magic-numbers

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.cases.forEach(([condition, result]) => {
      condition.setParent(this);
      result.setParent(this);
    });

    this.otherwise.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    const expectedType = BooleanType.baseType;

    this.cases.forEach(([condition, result]) => 
    {
      this.validateType(def, context, expectedType, condition, handler);
      
      result.validate(def, context, handler);
    });

    this.otherwise.validate(def, context, handler);
  }

  public if(condition: Expression, body?: Expression)
  {
    this.cases.push([condition, body || NoExpression.instance]);

    condition.setParent(this);

    if (body)
    {
      body.setParent(this);
    }

    return this;
  }

  public than(body: Expression)
  {
    this.cases[this.cases.length - 1][1] = body;

    body.setParent(this);

    return this;
  }

  public elseif(condition: Expression, body?: Expression)
  {
    this.cases.push([condition, body || NoExpression.instance]);

    condition.setParent(this);

    if (body)
    {
      body.setParent(this);
    }

    return this;
  }

  public else(body: Expression)
  {
    this.otherwise = body;
    this.otherwise.setParent(this);

    return this;
  }

}