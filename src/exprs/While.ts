
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

export class WhileExpression extends Expression 
{

  public static STEP_CONDITION = 'condition';

  public static STEP_BODY = 'body';

  public static MAX_ITERATIONS = DEFAULT_MAX_ITERATIONS;

  public static id = 'while';

  public static decode(data: any[], exprs: ExpressionProvider): WhileExpression 
  {
    const condition = exprs.getExpression(data[INDEX_CONDITION]);
    const body = exprs.getExpression(data[INDEX_BODY]);
    const max = parseInt(data[INDEX_MAX]) || this.MAX_ITERATIONS;
    
    return new WhileExpression(condition, body, max);
  }

  public static encode(expr: WhileExpression): any 
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
    return WhileExpression.id;
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

  public getScope(): undefined
  {
    return undefined;
  }

  public encode(): any 
  {
    return WhileExpression.encode(this);
  }

  public clone(): Expression
  {
    return new WhileExpression(this.condition.clone(), this.body.clone(), this.maxIterations);
  }

  public getType(def: DefinitionProvider, context: Type): Type | undefined
  {
    const body = this.body.getType(def, context);

    return body ? Types.optional(body) : undefined;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(WhileExpression.STEP_CONDITION, this.condition, (replaceWith) => this.condition = replaceWith);
      traverse.step(WhileExpression.STEP_BODY, this.body, (replaceWith) => this.body = replaceWith);
    });
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | undefined
  {
    return steps[0] === WhileExpression.STEP_CONDITION
      ? [1, this.condition]
      : steps[0] === WhileExpression.STEP_BODY
        ? [1, this.body]
        : undefined;
  }

  public setParent(parent?: Expression): void
  {
    this.parent = parent;

    this.condition.setParent(this);
    this.body.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    this.validateType(def, context, BooleanType.baseType, this.condition, handler);

    this.body.validate(def, context, handler);
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

  public while(condition: Expression)
  {
    this.condition = condition;
    this.condition.setParent(this);

    return this;
  }

  public do(body: Expression)
  {
    this.body = body;
    this.body.setParent(this);

    return this;
  }

  public withMax(iterations: number)
  {
    this.maxIterations = iterations;

    return this;
  }

}