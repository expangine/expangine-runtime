
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { Definitions } from '../Definitions';
import { toExpr } from '../fns';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';


const DEFAULT_MAX_ITERATIONS = 100000;
const DEFAULT_BREAK = 'break';
const INDEX_VARIABLE = 1;
const INDEX_START = 2;
const INDEX_END = 3;
const INDEX_BODY = 4;
const INDEX_BREAK = 5;
const INDEX_MAX = 6;

export class ForExpression extends Expression 
{

  public static STEP_START = 'start';

  public static STEP_END = 'end';

  public static STEP_BODY = 'body';

  public static MAX_ITERATIONS = DEFAULT_MAX_ITERATIONS;

  public static id = 'for';

  public static decode(data: any[], exprs: ExpressionProvider): ForExpression 
  {
    const variable = data[INDEX_VARIABLE];
    const start = exprs.getExpression(data[INDEX_START]);
    const end = exprs.getExpression(data[INDEX_END]);
    const body = exprs.getExpression(data[INDEX_BODY]);
    const breakVariable = data[INDEX_BREAK] || DEFAULT_BREAK;
    const max = parseInt(data[INDEX_MAX]) || this.MAX_ITERATIONS;
    
    return new ForExpression(variable, start, end, body, breakVariable, max);
  }

  public static encode(expr: ForExpression): any 
  {
    const out = [this.id, expr.variable, expr.start.encode(), expr.end.encode(), expr.body.encode()];
    const hasMax = expr.maxIterations !== this.MAX_ITERATIONS;

    if (expr.breakVariable !== DEFAULT_BREAK || hasMax) {
      out.push(expr.breakVariable);
    }
    if (hasMax) {
      out.push(expr.maxIterations);
    }

    return out;
  }

  public variable: string;
  public start: Expression;
  public end: Expression;
  public body: Expression;
  public breakVariable: string;
  public maxIterations: number;

  public constructor(variable: string, start: Expression, end: Expression, body: Expression, breakVariable: string = DEFAULT_BREAK, maxIterations: number = DEFAULT_MAX_ITERATIONS) 
  {
    super();
    this.variable = variable;
    this.start = start;
    this.end = end;
    this.body = body;
    this.breakVariable = breakVariable;
    this.maxIterations = maxIterations;
  }

  public getId(): string
  {
    return ForExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return Math.max(this.start.getComplexity(def), this.end.getComplexity(def), this.body.getComplexity(def)) + 1;
  }

  public getScope()
  {
    return {
      [this.variable]: NumberType.baseType.newInstance(),
      [this.breakVariable]: BooleanType.baseType
    };
  }

  public encode(): any 
  {
    return ForExpression.encode(this);
  }

  public getType(def: Definitions, original: Type): Type | null
  {
    const { context } = def.getContextWithScope(original, this.getScope());

    const body = this.body.getType(def, context);

    return body ? def.optionalType(body) : null;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(ForExpression.STEP_START, this.start);
      traverse.step(ForExpression.STEP_END, this.end);
      traverse.step(ForExpression.STEP_BODY, this.body);
    });
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === ForExpression.STEP_START
      ? [1, this.start]
      : steps[0] === ForExpression.STEP_END
        ? [1, this.end]
        : steps[0] === ForExpression.STEP_BODY
          ? [1, this.body]
          : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.start.setParent(this);
    this.end.setParent(this);
    this.body.setParent(this);
  }

  public validate(def: Definitions, context: Type, handler: ValidationHandler): void
  {
    this.validateType(def, context, NumberType.baseType, this.start, handler);
    this.validateType(def, context, NumberType.baseType, this.end, handler);

    const bodyContext = def.getContext(context, this.getScope());

    this.body.validate(def, bodyContext, handler);
  }

  public loop(variable: string, start: ExpressionValue, end: ExpressionValue, body?: Expression, breakVariable?: string, maxIterations?: number): ForExpression
  {
    return new ForExpression(variable, toExpr(start), toExpr(end), body || this.body, breakVariable || this.breakVariable, maxIterations || this.maxIterations);
  }

  public startAt(start: ExpressionValue): ForExpression
  {
    return new ForExpression(this.variable, toExpr(start), this.end, this.body, this.breakVariable, this.maxIterations);
  }

  public endAt(end: ExpressionValue): ForExpression
  {
    return new ForExpression(this.variable, this.start, toExpr(end), this.body, this.breakVariable, this.maxIterations);
  }

  public run(expr: Expression): ForExpression
  {
    return new ForExpression(this.variable, this.start, this.end, expr, this.breakVariable, this.maxIterations);
  }

  public withVariable(name: string)
  {
    return new ForExpression(name, this.start, this.end, this.body, this.breakVariable, this.maxIterations);
  }

  public withBreak(name: string)
  {
    return new ForExpression(this.variable, this.start, this.end, this.body, name, this.maxIterations);
  }

  public withMax(iterations: number)
  {
    return new ForExpression(this.variable, this.start, this.end, this.body, this.breakVariable, iterations);
  }

}