
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { AnyType } from '../types/Any';
import { Type } from '../Type';
import { BooleanType } from '../types/Boolean';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';
import { Exprs } from '../Exprs';
import { PathExpression } from './Path';


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
    const path = PathExpression.fromPartial(data[INDEX_PATH], exprs);
    const value = exprs.getExpression(data[INDEX_VALUE]);
    const currentVariable = data[INDEX_CURRENT] || DEFAULT_CURRENT; 

    return new UpdateExpression(path, value, currentVariable);
  }

  public static encode(expr: UpdateExpression): any 
  {
    const path = expr.path.encode();
    const value = expr.value.encode();

    return expr.currentVariable === DEFAULT_CURRENT
      ? [this.id, path, value]
      : [this.id, path, value, expr.currentVariable]
  }

  public static create(path: ExpressionValue[], value: ExpressionValue, currentVariable: string = DEFAULT_CURRENT)
  {
    return new UpdateExpression(Exprs.path(path), Exprs.parse(value), currentVariable);
  }

  public path: PathExpression;
  public value: Expression;
  public currentVariable: string;

  public constructor(path: PathExpression, value: Expression, currentVariable: string = DEFAULT_CURRENT) 
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

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return Math.max(this.path.getComplexity(def, context), this.value.getComplexity(def, context));
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
    return new UpdateExpression(this.path.clone(), this.value.clone(), this.currentVariable);
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return BooleanType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(UpdateExpression.STEP_PATH, this.path, (replaceWith) => this.path = Exprs.path([replaceWith]));
      traverse.step(UpdateExpression.STEP_VALUE, this.value, (replaceWith) => this.value = replaceWith);
    });
  }

  // tslint:disable: no-magic-numbers
  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === UpdateExpression.STEP_PATH
      ? [1, this.path]
      : steps[0] === UpdateExpression.STEP_VALUE
        ? [1, this.value]
        : null;
  }
  // tslint:enable: no-magic-numbers

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.path.setParent(this);
    this.value.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    this.path.validate(def, context, handler);

    const expectedType = this.path.getType(def, context);

    if (!this.path.isWritable(def))
    {
      handler({
        type: ValidationType.READONLY,
        severity: ValidationSeverity.HIGH,
        context,
        subject: this.path,
        parent: this,
      });
    }

    if (expectedType)
    {
      const valueContext = def.getContext(context, {
        [this.currentVariable]: expectedType,
      });

      this.validateType(def, valueContext, expectedType, this.value, handler);
    }
    else
    {
      handler({
        type: ValidationType.INVALID_EXPRESSION,
        severity: ValidationSeverity.HIGH,
        context,
        subject: this.path,
        parent: this,
      });
    }
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