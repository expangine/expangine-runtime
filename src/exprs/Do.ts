
import { Expression, ExpressionProvider } from '../Expression';
import { BooleanType } from '../types/Boolean';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { Types } from '../Types';
import { FlowType } from "../FlowType";


const DEFAULT_MAX_ITERATIONS = 100000;
const INDEX_CONDITION = 1;
const INDEX_BODY = 2;
const INDEX_MAX = 3;

export class DoExpression extends Expression 
{

  public static STEP_CONDITION = 'condition';

  public static STEP_BODY = 'body';

  public static MAX_ITERATIONS = DEFAULT_MAX_ITERATIONS;

  public static id = 'do';

  public static decode(data: any[], exprs: ExpressionProvider): DoExpression 
  {
    const condition = exprs.getExpression(data[INDEX_CONDITION]);
    const body = exprs.getExpression(data[INDEX_BODY]);
    const max = parseInt(data[INDEX_MAX]) || this.MAX_ITERATIONS;
    
    return new DoExpression(condition, body, max);
  }

  public static encode(expr: DoExpression): any 
  {
    return expr.maxIterations !== this.MAX_ITERATIONS
      ? [this.id, expr.condition.encode(), expr.body.encode(), expr.maxIterations]
      : [this.id, expr.condition.encode(), expr.body.encode()];
  }
  
  public condition: Expression;
  public body: Expression;
  public maxIterations: number;

  public constructor(condition: Expression, body: Expression, maxIterations: number = DEFAULT_MAX_ITERATIONS) 
  {
    super();
    this.condition = condition;
    this.body = body;
    this.maxIterations = maxIterations;
  }

  public getId(): string
  {
    return DoExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return 1 + Math.max(
      this.condition.getComplexity(def, context), 
      this.body.getComplexity(def, context)
    );
  }

  public isDynamic(): boolean
  {
    return this.body.isDynamic();
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return DoExpression.encode(this);
  }

  public clone(): Expression
  {
    return new DoExpression(this.condition.clone(), this.body.clone(), this.maxIterations);
  }

  public getType(def: DefinitionProvider, original: Type): Type | null
  {
    const { context } = def.getContextWithScope(original, this.getScope());

    const body = this.body.getType(def, context);

    return body ? Types.optional(body) : null;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(DoExpression.STEP_CONDITION, this.condition, (replaceWith) => this.condition = replaceWith);
      traverse.step(DoExpression.STEP_BODY, this.body, (replaceWith) => this.body = replaceWith);
    });
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === DoExpression.STEP_CONDITION
      ? [1, this.condition]
      : steps[0] === DoExpression.STEP_BODY
        ? [1, this.body]
        : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.condition.setParent(this);
    this.body.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    this.validateType(def, context, BooleanType.baseType, this.condition, handler);

    const bodyContext = def.getContext(context, this.getScope());

    this.body.validate(def, bodyContext, handler);
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    return this.condition.mutates(def, arg, directly) || 
      this.body.mutates(def, arg, directly);
  }

  public isValidFlow(def: DefinitionProvider, type: FlowType, child?: Expression): boolean
  {
    return (child === this.body && (type === FlowType.BREAK || type === FlowType.CONTINUE)) || super.isValidFlow(def, type);
  }

  public do(body: Expression, condition?: Expression): DoExpression
  {
    this.body = body;
    this.body.setParent(this);

    if (condition)
    {
      this.condition = condition;
      this.condition.setParent(this);
    }

    return this;
  }

  public while(condition: Expression): DoExpression
  {
    this.condition = condition;
    this.condition.setParent(this);

    return this;
  }

  public withMax(iterations: number)
  {
    this.maxIterations = iterations;

    return this;
  }

}