
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';
import { PathExpression } from './Path';


const INDEX_NAME = 1;
const INDEX_EXPRESSION = 2;

export class ComputedExpression extends Expression 
{

  public static STEP_EXPRESSION = 'expression';

  public static id = 'comp';

  public static decode(data: any[], exprs: ExpressionProvider) 
  {
    const name = data[INDEX_NAME];

    if (data[INDEX_EXPRESSION]) 
    {
      const expression = exprs.getExpression(data[INDEX_EXPRESSION]);

      exprs.setLegacy();

      return PathExpression.createForLegacy([expression, new ComputedExpression(name)]);
    }
    
    return new ComputedExpression(name);
  }

  public static encode(expr: ComputedExpression): any 
  {
    return [this.id, expr.name];
  }

  public name: string;

  public constructor(name: string) 
  {
    super();
    this.name = name;
  }

  public getId(): string
  {
    return ComputedExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    const comp = def.getComputed(this.name);

    if (!comp)
    {
      return 0;
    }

    const op = def.getOperation(comp.op);    
    
    return op ? op.complexity : 0;
  }

  public getScope(): undefined
  {
    return undefined;
  }

  public encode(): any 
  {
    return ComputedExpression.encode(this);
  }

  public clone(): Expression
  {
    return new ComputedExpression(this.name);
  }

  public getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | undefined
  {
    return thisType ? def.getComputedReturnType(this.name, thisType) : undefined;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this);
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | undefined
  {
    return undefined;
  }

  public setParent(parent?: Expression): void
  {
    this.parent = parent;
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler, thisType?: Type): void
  {
    if (!thisType)
    {
      handler({
        type: ValidationType.OUTSIDE_PATH,
        severity: ValidationSeverity.HIGH,
        context,
        subject: this,
      });
    }
    else
    {
      if (!def.hasComputed(thisType, this.name))
      {
        handler({
          type: ValidationType.INVALID_EXPRESSION,
          severity: ValidationSeverity.HIGH,
          context,
          subject: this,
        });
      }
    }
  }

  public mutates(def: DefinitionProvider, arg: string): boolean
  {
    return false;
  }

  public isPathNode(): boolean
  {
    return true;
  }

  public isPathWritable(defs: DefinitionProvider): boolean
  {
    const comp = defs.getComputed(this.name);

    return !comp || !!comp.writeable;
  }

}