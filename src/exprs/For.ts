
import { Expression, ExpressionProvider } from '../Expression';


export class ForExpression extends Expression 
{

  public static MAX_ITERATIONS = 1024 * 1024;

  public static id = 'for';

  public static decode(data: any[], exprs: ExpressionProvider): ForExpression 
  {
    const variable = data[1];
    const start = exprs.getExpression(data[2]);
    const end = exprs.getExpression(data[3]);
    const body = exprs.getExpression(data[4]);
    const max = parseInt(data[5]) || this.MAX_ITERATIONS;
    
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