import { Type, TypeMap } from './Type';
import { Definitions } from './Definitions';
import { Traversable, Traverser } from './Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity, Validation } from './Validate';


export interface ExpressionProvider 
{ 
  getExpression(value: any): Expression;
}

export interface ExpressionClass<T extends Expression = any> 
{
  id: string;
  decode(this: ExpressionClass<T>, data: any[], exprs: ExpressionProvider): T;
  encode(this: ExpressionClass<T>, expr: T): any;
  new(...args: any[]): T;
}

export type ExpressionValue = any | Expression;

export type ExpressionMap = Record<string, Expression>;

export abstract class Expression implements Traversable<Expression>
{

  public parent: Expression = null;
  
  public abstract getId(): string;

  public abstract getScope(): TypeMap | null;

  public abstract getComplexity(def: Definitions): number;

  public abstract encode(): any;

  public abstract getType(def: Definitions, context: Type): Type | null;

  public abstract traverse<R>(traverse: Traverser<Expression, R>): R;

  public abstract setParent(parent?: Expression): void;

  public abstract validate(def: Definitions, context: Type, handler: ValidationHandler): void;

  public validations(def: Definitions, context: Type): Validation[]
  {
    const validations: Validation[] = [];

    this.validate(def, context, x => validations.push(x));

    return validations;
  }

  protected validateType(def: Definitions, context: Type, expectedType: Type, subject: Expression | null, handler: ValidationHandler, parent: Expression = this): void
  {
    const actualType = subject ? subject.getType(def, context) : null;
    let testType = actualType;

    if (!actualType)
    {
      handler({
        type: ValidationType.INCOMPATIBLE_TYPES,
        severity: ValidationSeverity.HIGH,
        context,
        subject,
        parent,
      });
    }
    else
    {
      if (actualType.isOptional() && !expectedType.isOptional())
      {
        testType = def.requiredType(testType);
      }

      if (!expectedType.acceptsType(testType))
      {
        handler({
          type: ValidationType.INCOMPATIBLE_TYPES,
          severity: expectedType.isCompatible(actualType)
            ? ValidationSeverity.MEDIUM
            : ValidationSeverity.HIGH,
          context,
          subject,
          parent,
        });
      }
      else if (testType !== actualType)
      {
        handler({
          type: ValidationType.POSSIBLY_NULL,
          severity: ValidationSeverity.MEDIUM,
          context,
          subject,
          parent,
        });
      }
    }

    if (subject)
    {
      subject.validate(def, context, handler);
    }
  }

  protected validatePath(def: Definitions, context: Type, start: Type, subjects: Expression[], handler: ValidationHandler, parent: Expression = this): void
  {
    let node = start;

    subjects.forEach(subject => 
    {
      if (node)
      {
        node = node.getSubType(subject, def, context);
      }

      if (!node)
      {
        handler({
          type: ValidationType.INVALID_EXPRESSION,
          severity: ValidationSeverity.HIGH,
          subject,
          context,
          parent,
        });
      }

      subject.validate(def, context, handler);
    });
  }

}