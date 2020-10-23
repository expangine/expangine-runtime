
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { NumberType } from '../types/Number';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { Types } from '../Types';
import { Exprs } from '../Exprs';
import { isNumber } from '../fns';
import { ConstantExpression } from './Constant';
import { FlowType } from "../FlowType";


const DEFAULT_MAX_ITERATIONS = 100000;
const INDEX_VARIABLE = 1;
const INDEX_START = 2;
const INDEX_END = 3;
const INDEX_BODY = 4;
const INDEX_BY = 5;
const INDEX_MAX = 6;

export class ForExpression extends Expression 
{

  public static STEP_START = 'start';

  public static STEP_END = 'end';

  public static STEP_BODY = 'body';

  public static STEP_BY = 'by';

  public static MAX_ITERATIONS = DEFAULT_MAX_ITERATIONS;

  public static id = 'for';

  public static decode(data: any[], exprs: ExpressionProvider): ForExpression 
  {
    const variable = data[INDEX_VARIABLE];
    const start = exprs.getExpression(data[INDEX_START]);
    const end = exprs.getExpression(data[INDEX_END]);
    const body = exprs.getExpression(data[INDEX_BODY]);
    const by = exprs.getExpression(data[INDEX_BY]) || new ConstantExpression(1);
    const max = parseInt(data[INDEX_MAX]) || this.MAX_ITERATIONS;
    
    return new ForExpression(variable, start, end, body, by, max);
  }

  public static encode(expr: ForExpression): any 
  {
    const data = [this.id, expr.variable, expr.start.encode(), expr.end.encode(), expr.body.encode()];
    const hasBy = !(expr.by instanceof ConstantExpression) || expr.by.value !== 1;
    const hasMax = expr.maxIterations !== this.MAX_ITERATIONS;

    if (hasBy) {
      data.push(expr.by.encode());
    } else if (hasMax) {
      data.push(1);
    }

    if (hasMax) {
      data.push(expr.maxIterations);
    }

    return data;
  }

  public variable: string;
  public start: Expression;
  public end: Expression;
  public body: Expression;
  public by: Expression;
  public maxIterations: number;

  public constructor(variable: string, start: Expression, end: Expression, body: Expression, by: Expression, maxIterations: number = DEFAULT_MAX_ITERATIONS) 
  {
    super();
    this.variable = variable;
    this.start = start;
    this.end = end;
    this.body = body;
    this.by = by;
    this.maxIterations = maxIterations;
  }

  public getId(): string
  {
    return ForExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return 1 + Math.max(
      this.start.getComplexity(def, context), 
      this.end.getComplexity(def, context), 
      this.body.getComplexity(def, context), 
      this.by.getComplexity(def, context)
    );
  }

  public isDynamic(): boolean
  {
    return this.body.isDynamic();
  }

  public getScope()
  {
    return {
      [this.variable]: NumberType.baseType.newInstance(),
    };
  }

  public encode(): any 
  {
    return ForExpression.encode(this);
  }

  public clone(): Expression
  {
    return new ForExpression(this.variable, this.start.clone(), this.end.clone(), this.body.clone(), this.by.clone(), this.maxIterations);
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
      traverse.step(ForExpression.STEP_START, this.start, (replaceWith) => this.start = replaceWith);
      traverse.step(ForExpression.STEP_END, this.end, (replaceWith) => this.end = replaceWith);
      traverse.step(ForExpression.STEP_BODY, this.body, (replaceWith) => this.body = replaceWith);
      traverse.step(ForExpression.STEP_BY, this.by, (replaceWith) => this.by = replaceWith);
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
          : steps[0] === ForExpression.STEP_BY
            ? [1, this.by]
            : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.start.setParent(this);
    this.end.setParent(this);
    this.body.setParent(this);
    this.by.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    this.validateType(def, context, NumberType.baseType, this.start, handler);
    this.validateType(def, context, NumberType.baseType, this.end, handler);
    this.validateType(def, context, NumberType.baseType, this.by, handler);

    const bodyContext = def.getContext(context, this.getScope());

    this.body.validate(def, bodyContext, handler);
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    return this.start.mutates(def, arg, directly) || 
      this.end.mutates(def, arg, directly) || 
      this.body.mutates(def, arg, directly) || 
      this.by.mutates(def, arg, directly);
  }

  public isValidFlow(def: DefinitionProvider, type: FlowType, child?: Expression): boolean
  {
    return (child === this.body && (type === FlowType.BREAK || type === FlowType.CONTINUE)) || super.isValidFlow(def, type);
  }

  public loop(variable: string, start: ExpressionValue, end: ExpressionValue, body?: Expression, by?: ExpressionValue, maxIterations?: number): ForExpression
  {
    this.variable = variable;

    this.start = Exprs.parse(start);
    this.start.setParent(this);

    this.end = Exprs.parse(end);
    this.end.setParent(this);

    if (body)
    {
      this.body = body;
      this.body.setParent(this);
    }

    if (by)
    {
      this.by = Exprs.parse(by);
      this.by.setParent(this);
    }

    if (isNumber(maxIterations))
    {
      this.maxIterations = maxIterations;
    }

    return this;
  }

  public startAt(start: ExpressionValue): ForExpression
  {
    this.start = Exprs.parse(start);
    this.start.setParent(this);

    return this;
  }

  public endAt(end: ExpressionValue): ForExpression
  {
    this.end = Exprs.parse(end);
    this.end.setParent(this);

    return this;
  }

  public inc(by: ExpressionValue): ForExpression
  {
    this.by = Exprs.parse(by);
    this.by.setParent(this);

    return this;
  }

  public run(expr: Expression): ForExpression
  {
    this.body = expr;
    this.body.setParent(this);

    return this;
  }

  public withVariable(name: string)
  {
    this.variable = name;

    return this;
  }

  public withMax(iterations: number)
  {
    this.maxIterations = iterations;

    return this;
  }

}