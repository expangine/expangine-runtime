
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { AnyType } from '../types/Any';
import { Type } from '../Type';
import { BooleanType } from '../types/Boolean';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';
import { Exprs } from '../Exprs';
import { PathExpression } from './Path';


const INDEX_PATH = 1;
const INDEX_VALUE = 2;
const INDEX_CURRENT = 3;
const NO_VARIABLE = '';

export class SetExpression extends Expression 
{

  public static STEP_PATH = 'path';

  public static STEP_VALUE = 'value';

  public static id = 'set';

  public static decode(data: any[], exprs: ExpressionProvider): SetExpression 
  {
    const path = PathExpression.fromPartial(data[INDEX_PATH], exprs);
    const value = exprs.getExpression(data[INDEX_VALUE]);
    const currentVariable = data[INDEX_CURRENT]; 

    return new SetExpression(path, value, currentVariable);
  }

  public static encode(expr: SetExpression): any 
  {
    const path = expr.path.encode();
    const value = expr.value.encode();

    return expr.currentVariable
      ? [this.id, path, value, expr.currentVariable]
      : [this.id, path, value];
  }

  public static create(path: ExpressionValue[], value: ExpressionValue, currentVariable: string = NO_VARIABLE)
  {
    return new SetExpression(Exprs.path(path), Exprs.parse(value), currentVariable);
  }

  public path: PathExpression;
  public value: Expression;
  public currentVariable: string;

  public constructor(path: PathExpression, value: Expression, currentVariable: string = NO_VARIABLE) 
  {
    super();
    this.path = path;
    this.value = value;
    this.currentVariable = currentVariable;
  }

  public getId(): string
  {
    return SetExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return Math.max(this.path.getComplexity(def, context), this.value.getComplexity(def, context));
  }

  public getScope()
  {
    return this.currentVariable
      ? { [this.currentVariable]: AnyType.baseType }
      : null;
  }

  public encode(): any 
  {
    return SetExpression.encode(this);
  }

  public clone(): Expression
  {
    return new SetExpression(this.path.clone(), this.value.clone(), this.currentVariable);
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return BooleanType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(SetExpression.STEP_PATH, this.path, (replaceWith) => this.path = Exprs.path([replaceWith]));
      traverse.step(SetExpression.STEP_VALUE, this.value, (replaceWith) => this.value = replaceWith);
    });
  }

  // tslint:disable: no-magic-numbers
  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === SetExpression.STEP_PATH
      ? [1, this.path]
      : steps[0] === SetExpression.STEP_VALUE
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
      const valueContext = this.currentVariable
        ? def.getContext(context, {
            [this.currentVariable]: expectedType,
          })
        : context;

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

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    return this.path.isMutating(arg, directly) || this.value.mutates(def, arg, directly) || this.path.mutates(def, arg, directly);
  }

  public to(value: ExpressionValue, currentVariable: string = NO_VARIABLE): SetExpression
  {
    this.value = Exprs.parse(value);
    this.value.setParent(this);
    this.currentVariable = currentVariable;

    return this;
  }

  public withVariable(name: string): SetExpression
  {
    this.currentVariable = name;

    return this;
  }

}