
import { Expression, ExpressionProvider } from '../Expression';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { Definitions } from '../Definitions';


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

  public constructor(variable: string, start: Expression, end: Expression, body: Expression, breakVariable: string, maxIterations: number) 
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
      [this.variable]: NumberType.baseType,
      [this.breakVariable]: BooleanType.baseType
    };
  }

  public encode(): any 
  {
    return ForExpression.encode(this);
  }

}