
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
    const breakVariable = data[INDEX_BREAK] || DEFAULT_BREAK;
    const max = parseInt(data[INDEX_MAX]) || this.MAX_ITERATIONS;
    
    return new DoExpression(condition, body, breakVariable, max);
  }

  public static encode(expr: DoExpression): any 
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
    return DoExpression.id;
  }

  public getComplexity(def: DefinitionProvider): number
  {
    return Math.max(this.condition.getComplexity(def), this.body.getComplexity(def)) + 1;
  }

  public getScope()
  {
    return {
      [this.breakVariable]: BooleanType.baseType
    };
  }

  public encode(): any 
  {
    return DoExpression.encode(this);
  }

  public clone(): Expression
  {
    return new DoExpression(this.condition.clone(), this.body.clone(), this.breakVariable, this.maxIterations);
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