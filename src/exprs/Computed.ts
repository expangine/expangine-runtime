
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';


const INDEX_NAME = 1;
const INDEX_EXPRESSION = 2;

export class ComputedExpression extends Expression 
{
  
  public static STEP_EXPRESSION = 'expression';

  public static id = 'comp';

  public static decode(data: any[], exprs: ExpressionProvider): ComputedExpression 
  {
    const name = data[INDEX_NAME];
    const expression = exprs.getExpression(data[INDEX_EXPRESSION]);
    
    return new ComputedExpression(expression, name);
  }

  public static encode(expr: ComputedExpression): any 
  {
    return [this.id, expr.name, expr.expression.encode()];
  }

  public expression: Expression;
  public name: string;

  public constructor(expression: Expression, name: string) 
  {
    super();
    this.expression = expression;
    this.name = name;
  }

  public getId(): string
  {
    return ComputedExpression.id;
  }

  public getComplexity(def: DefinitionProvider): number
  {
    const comp = def.getComputed(this.name);

    if (!comp)
    {
      return 0;
    }

    const op = def.getOperation(comp.op);    
    
    return Math.max(op ? op.complexity : 0, this.expression.getComplexity(def));
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return ComputedExpression.encode(this);
  }

  public clone(): Expression
  {
    return new ComputedExpression(this.expression.encode(), this.name);
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return def.getComputedReturnType(this.name, this.expression.getType(def, context));
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () =>
      traverse.step(ComputedExpression.STEP_EXPRESSION, this.expression, (replaceWith) => this.expression = replaceWith)
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === ComputedExpression.STEP_EXPRESSION
      ? [1, this.expression]
      : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;
    this.expression.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    const baseType = this.expression.getType(def, context);

    if (!baseType || !def.hasComputed(baseType, this.name))
    {
      handler({
        type: ValidationType.INVALID_EXPRESSION,
        severity: ValidationSeverity.HIGH,
        context,
        subject: this.expression,
        parent: this,
      })
    }

    this.expression.validate(def, context, handler);
  }

}