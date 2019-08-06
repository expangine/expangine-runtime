
import { Expression, ExpressionProvider } from '../Expression';


const DEFAULT_MAX_ITERATIONS = 100000;
const INDEX_CONDITION = 1;
const INDEX_BODY = 2;
const INDEX_MAX = 3;

export class WhileExpression extends Expression 
{

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