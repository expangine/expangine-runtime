
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { AnyType } from '../types/Any';
import { isArray, isNumber } from '../fns';
import { Type } from '../Type';
import { BooleanType } from '../types/Boolean';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { Exprs } from '../Exprs';


const DEFAULT_CURRENT = 'current';
const INDEX_PATH = 1;
const INDEX_VALUE = 2;
const INDEX_CURRENT = 3;

export class UpdateExpression extends Expression 
{

  public static STEP_PATH = 'path';

  public static STEP_VALUE = 'value';

  public static id = 'up';

  public static decode(data: any[], exprs: ExpressionProvider): UpdateExpression 
  {
    const path: Expression[] = data[INDEX_PATH].map((part: any) => exprs.getExpression(part));
    const value = exprs.getExpression(data[INDEX_VALUE]);
    const currentVariable = data[INDEX_CURRENT] || DEFAULT_CURRENT;

    return new UpdateExpression(path, value, currentVariable);
  }

  public static encode(expr: UpdateExpression): any 
  {
    const path = expr.path.map(e => e.encode());
    const value = expr.value.encode();

    return expr.currentVariable === DEFAULT_CURRENT
      ? [this.id, path, value]
      : [this.id, path, value, expr.currentVariable]
  }

  public static create(path: ExpressionValue[], value: ExpressionValue, currentVariable: string = DEFAULT_CURRENT)
  {
    return new UpdateExpression(Exprs.parse(path), Exprs.parse(value), currentVariable);
  }

  public path: Expression[];
  public value: Expression;
  public currentVariable: string;

  public constructor(path: Expression[], value: Expression, currentVariable: string = DEFAULT_CURRENT) 
  {
    super();
    this.path = path;
    this.value = value;
    this.currentVariable = currentVariable;
  }

  public getId(): string
  {
    return UpdateExpression.id;
  }

  public getComplexity(def: DefinitionProvider): number
  {
    return this.path.reduce((max, e) => Math.max(max, e.getComplexity(def)), this.value.getComplexity(def));
  }

  public getScope()
  {
    return {
      [this.currentVariable]: AnyType.baseType
    };
  }

  public encode(): any 
  {
    return UpdateExpression.encode(this);
  }

  public clone(): Expression
  {
    return new UpdateExpression(this.path.map((p) => p.clone()), this.value.clone(), this.currentVariable);
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return BooleanType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(UpdateExpression.STEP_PATH, () => 
        this.path.forEach((expr, index) => 
          traverse.step(index, expr, (replaceWith) => this.path.splice(index, 1, replaceWith), () => this.path.splice(index, 1))
        )
      );
      traverse.step(UpdateExpression.STEP_VALUE, this.value, (replaceWith) => this.value = replaceWith);
    });
  }

  // tslint:disable: no-magic-numbers
  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === UpdateExpression.STEP_PATH
      ? isNumber(steps[1]) && steps[1] < this.path.length
        ? [2, this.path[steps[1]]]
        : null
      : steps[0] === UpdateExpression.STEP_VALUE
        ? [1, this.value]
        : null;
  }
  // tslint:enable: no-magic-numbers

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.path.forEach(e => e.setParent(this));
    this.value.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    this.validatePath(def, context, context, this.path, handler);

    const expectedType = def.getPathType(this.path, context);

    if (expectedType)
    {
      const valueContext = def.getContext(context, {
        [this.currentVariable]: expectedType,
      });

      this.validateType(def, valueContext, expectedType, this.value, handler);
    }
  }

  public add(expr: ExpressionValue | ExpressionValue[]): UpdateExpression
  {
    const append = isArray(expr)
      ? expr
      : [expr];

    for (const nodeValue of append)
    {
      const node = Exprs.parse(nodeValue);
      this.path.push(node);
      node.setParent(this);
    }


    return this;
  }

  public to(value: ExpressionValue, currentVariable?: string): UpdateExpression
  {
    this.value = Exprs.parse(value);
    this.value.setParent(this);
    this.currentVariable = currentVariable || this.currentVariable;

    return this;
  }

  public withVariable(name: string): UpdateExpression
  {
    this.currentVariable = name;

    return this;
  }

}