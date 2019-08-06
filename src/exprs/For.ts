
import { Expression, ExpressionProvider } from '../Expression';


const DEFAULT_MAX_ITERATIONS = 100000;
const INDEX_VARIABLE = 1;
const INDEX_START = 2;
const INDEX_END = 3;
const INDEX_BODY = 4;
const INDEX_MAX = 5;

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
    const max = parseInt(data[INDEX_MAX]) || this.MAX_ITERATIONS;
    
    return new ForExpression(variable, start, end, body, max);
  }

  public static encode(expr: ForExpression): any 
  {
    return expr.maxIterations === this.MAX_ITERATIONS
      ? [this.id, expr.variable, expr.start.encode(), expr.end.encode(), expr.body.encode()]
      : [this.id, expr.variable, expr.start.encode(), expr.end.encode(), expr.body.encode(), expr.maxIterations];
  }

  public variable: string;
  public start: Expression;
  public end: Expression;
  public body: Expression;
  public maxIterations: number;

  public constructor(variable: string, start: Expression, end: Expression, body: Expression, maxIterations: number) 
  {
    super(ForExpression.id);
    this.variable = variable;
    this.start = start;
    this.end = end;
    this.body = body;
    this.maxIterations = maxIterations;
  }

  public encode(): any 
  {
    return ForExpression.encode(this);
  }

}