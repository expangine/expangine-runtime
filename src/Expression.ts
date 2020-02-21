import { Type, TypeMap } from './Type';
import { Definitions } from './Definitions';
import { Traversable, Traverser, TraverseStep } from './Traverser';
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
  
  public getPath(): TraverseStep[]
  {
    return this.getRootExpression().traverse(new Traverser((type, _, path, traverser) =>
    {
      if (type === this)
      {
        traverser.stop(path.slice());
      }
    }));
  }

  public getExpressionFromPath(path: TraverseStep[]): Expression | null
  {
    if (path.length === 0)
    {
      return this;
    }
    
    const step = this.getExpressionFromStep(path);

    if (!step || !step[1])
    {
      return null;
    }

    const [steps, expr] = step;

    return expr.getExpressionFromPath(path.slice(steps));
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return null;
  }

  public getRootExpression(): Expression
  {
    let node: Expression = this;

    while (node.parent)
    {
      node = node.parent;
    }

    return node;
  }

  public validations(def: Definitions, context: Type): Validation[]
  {
    const validations: Validation[] = [];

    this.validate(def, context, x => validations.push(x));

    return validations;
  }

  protected validateType(def: Definitions, context: Type, expectedComplex: Type, subject: Expression | null, handler: ValidationHandler, parent: Expression = this): void
  {
    const expected = expectedComplex ? expectedComplex.getSimplifiedType() : null;
    const actualComplete = subject ? subject.getType(def, context) : null;
    const actual = actualComplete ? actualComplete.getSimplifiedType() : null;
    let test = actual;

    if (!actual)
    {
      if (expected && !expected.isOptional())
      {
        handler({
          type: ValidationType.INCOMPATIBLE_TYPES,
          severity: ValidationSeverity.HIGH,
          context,
          subject,
          parent,
          expected,
        });
      }
    }
    else
    {
      if (actual.isOptional() && !expected.isOptional())
      {
        test = def.requiredType(test);
      }

      if (!expected.acceptsType(test))
      {
        handler({
          type: ValidationType.INCOMPATIBLE_TYPES,
          severity: expected.isCompatible(actual)
            ? ValidationSeverity.MEDIUM
            : ValidationSeverity.HIGH,
          context,
          subject,
          parent,
          expected,
          actual,
        });
      }
      else if (test !== actual)
      {
        handler({
          type: ValidationType.POSSIBLY_NULL,
          severity: ValidationSeverity.MEDIUM,
          context,
          subject,
          parent,
          expected,
          actual,
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