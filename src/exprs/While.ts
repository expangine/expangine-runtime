
import { Expression, ExpressionProvider } from '../Expression';


export class WhileExpression extends Expression 
{

  public static MAX_ITERATIONS = 1024 * 1024;

  public static id = 'while';

  public static decode(data: any[], exprs: ExpressionProvider): WhileExpression 
  {
    const condition = exprs.getExpression(data[1]);
    const body = exprs.getExpression(data[2]);
    const max = parseInt(data[3]) || this.MAX_ITERATIONS;
    
    return new WhileExpression(condition, body, max);
  }

  public static encode(expr: WhileExpression): any 
  {
    return expr.maxIterations === this.MAX_ITERATIONS
      ? [this.id, expr.condition.encode(), expr.body.encode()]
      : [this.id, expr.condition.encode(), expr.body.encode(), expr.maxIterations];
  }
  
  public condition: Expression;
  public body: Expression;
  public maxIterations: number;

  public constructor(condition: Expression, body: Expression, maxIterations: number) 
  {
    super(WhileExpression.id);
    this.condition = condition;
    this.body = body;
    this.maxIterations = maxIterations;
  }

  public encode(): any 
  {
    return WhileExpression.encode(this);
  }

}