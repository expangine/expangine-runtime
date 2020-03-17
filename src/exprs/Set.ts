
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { BooleanType } from '../types/Boolean';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';
import { Exprs } from '../Exprs';
import { PathExpression } from './Path';


const INDEX_PATH = 1;
const INDEX_VALUE = 2;

export class SetExpression extends Expression 
{

  public static STEP_PATH = 'path';

  public static STEP_VALUE = 'value';

  public static id = 'set';

  public static decode(data: any[], exprs: ExpressionProvider): SetExpression 
  {
    const path = PathExpression.decode(['path', data[INDEX_PATH]], exprs);
    const value = exprs.getExpression(data[INDEX_VALUE]);

    return new SetExpression(path, value);
  }

  public static encode(expr: SetExpression): any 
  {
    return [this.id, expr.path.encode(), expr.value.encode()];
  }

  public static create(path: ExpressionValue[], value: ExpressionValue)
  {
    return new SetExpression(Exprs.path(path), Exprs.parse(value));
  }

  public path: PathExpression;
  public value: Expression;

  public constructor(path: PathExpression, value: Expression) 
  {
    super();

    this.path = path;
    this.value = value;
  }

  public getId(): string
  {
    return SetExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return Math.max(this.path.getComplexity(def, context), this.value.getComplexity(def, context));
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return SetExpression.encode(this);
  }

  public clone(): Expression
  {
    return new SetExpression(this.path.clone(), this.value.clone());
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return BooleanType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(SetExpression.STEP_PATH, this.path, (replaceWith) => this.path = Exprs.path(replaceWith));
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
      this.validateType(def, context, expectedType, this.value, handler);
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

  public to(value: ExpressionValue): SetExpression
  {
    this.value = Exprs.parse(value);
    this.value.setParent(this);

    return this;
  }

}