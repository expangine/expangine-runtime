
import { Expression, ExpressionProvider } from '../Expression';
import { BooleanType } from '../types/Boolean';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { Types } from '../Types';


const DEFAULT_MAX_ITERATIONS = 100000;
const DEFAULT_BREAK = 'break';
const INDEX_CONDITION = 1;
const INDEX_BODY = 2;
const INDEX_BREAK = 3;
const INDEX_MAX = 4;

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
    const breakVariable = data[INDEX_BREAK] || DEFAULT_BREAK;
    const max = parseInt(data[INDEX_MAX]) || this.MAX_ITERATIONS;
    
    return new WhileExpression(condition, body, breakVariable, max);
  }

  public static encode(expr: WhileExpression): any 
  {
    const out = [this.id, expr.condition.encode(), expr.body.encode()];
    const hasMax = expr.maxIterations !== this.MAX_ITERATIONS;

    if (expr.breakVariable !== DEFAULT_BREAK || hasMax) {
      out.push(expr.breakVariable);
    }
    if (hasMax) {
      out.push(expr.maxIterations);
    }
    
    return out;
  }
  
  public condition: Expression;
  public body: Expression;
  public breakVariable: string;
  public maxIterations: number;

  public constructor(condition: Expression, body: Expression, breakVariable: string = DEFAULT_BREAK, maxIterations: number = DEFAULT_MAX_ITERATIONS) 
  {
    super();
    this.condition = condition;
    this.body = body;
    this.breakVariable = breakVariable;
    this.maxIterations = maxIterations;
  }

  public getId(): string
  {
    return WhileExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return Math.max(this.condition.getComplexity(def, context), this.body.getComplexity(def, context)) + 1;
  }

  public isDynamic(): boolean
  {
    return this.body.isDynamic();
  }

  public getScope()
  {
    return {
      [this.breakVariable]: BooleanType.baseType
    };
  }

  public encode(): any 
  {
    return WhileExpression.encode(this);
  }

  public clone(): Expression
  {
    return new WhileExpression(this.condition.clone(), this.body.clone(), this.breakVariable, this.maxIterations);
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
      traverse.step(WhileExpression.STEP_CONDITION, this.condition, (replaceWith) => this.condition = replaceWith);
      traverse.step(WhileExpression.STEP_BODY, this.body, (replaceWith) => this.body = replaceWith);
    });
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === WhileExpression.STEP_CONDITION
      ? [1, this.condition]
      : steps[0] === WhileExpression.STEP_BODY
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

  public withBreak(name: string)
  {
    this.breakVariable = name;

    return this;
  }

  public withMax(iterations: number)
  {
    this.maxIterations = iterations;

    return this;
  }

}