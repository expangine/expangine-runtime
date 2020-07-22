import { Type, TypeMap } from './Type';
import { DefinitionProvider } from './DefinitionProvider';
import { Traversable, Traverser, TraverseStep } from './Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity, Validation } from './Validate';


export interface ExpressionProvider 
{ 
  getExpression(value: any): Expression;
  setLegacy(): void;
}

export interface ExpressionClass<T extends Expression = any> 
{
  id: string;
  decode(this: ExpressionClass<T>, data: any[], exprs: ExpressionProvider): Expression;
  encode(this: ExpressionClass<T>, expr: T): any;
  new(...args: any[]): T;
}

export type ExpressionValue = any | Expression;

export type ExpressionMap = Record<string, Expression>;

export abstract class Expression implements Traversable<Expression>
{

  public static THIS = 'this';

  public static INSTANCE = 'instance';

  public parent: Expression = null;
  
  public abstract getId(): string;

  public abstract getScope(): TypeMap | null;

  public abstract getComplexity(def: DefinitionProvider, context: Type): number;

  public abstract encode(): any;

  public abstract clone(): Expression;

  public abstract getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | null;

  public abstract traverse<R>(traverse: Traverser<Expression, R>): R;

  public abstract setParent(parent?: Expression): void;

  public abstract validate(def: DefinitionProvider, context: Type, handler: ValidationHandler, thisType?: Type): void;
  
  public getInnerExpression(def: DefinitionProvider): Expression | string | false
  {
    return false;
  }

  public isPathStart(): boolean
  {
    return false;
  }

  public isPathNode(): boolean
  {
    return false;
  }

  public isPathWritable(defs: DefinitionProvider): boolean
  {
    return true;
  }
  
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

  public validations(def: DefinitionProvider, context: Type): Validation[]
  {
    const validations: Validation[] = [];

    this.validate(def, context, x => validations.push(x));

    return validations;
  }

  protected validateType(def: DefinitionProvider, context: Type, expectedComplex: Type, subject: Expression | null, handler: ValidationHandler, parent: Expression = this): void
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
        test = test.getRequired();
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

}