
import { Expression, ExpressionProvider } from '../Expression';
import { BooleanType } from '../types/Boolean';


const DEFAULT_MAX_ITERATIONS = 100000;
const DEFAULT_BREAK = 'break';
const INDEX_CONDITION = 1;
const INDEX_BODY = 2;
const INDEX_BREAK = 3;
const INDEX_MAX = 4;

export class DoExpression extends Expression 
{

  public static MAX_ITERATIONS = DEFAULT_MAX_ITERATIONS;

  public static id = 'do';

  public static decode(data: any[], exprs: ExpressionProvider): DoExpression 
  {
    const condition = exprs.getExpression(data[INDEX_CONDITION]);
    const body = exprs.getExpression(data[INDEX_BODY]);
    const breakCondition = data[INDEX_BREAK] || DEFAULT_BREAK;
    const max = parseInt(data[INDEX_MAX]) || this.MAX_ITERATIONS;
    
    return new DoExpression(condition, body, breakCondition, max);
  }

  public static encode(expr: DoExpression): any 
  {
    const out = [this.id, expr.condition.encode(), expr.body.encode()];

    if (expr.breakCondition !== DEFAULT_BREAK) {
      out.push(expr.breakCondition);
    }
    if (expr.maxIterations !== this.MAX_ITERATIONS) {
      out.push(expr.maxIterations);
    }

    return out;
  }
  
  public condition: Expression;
  public body: Expression;
  public breakCondition: string;
  public maxIterations: number;

  public constructor(condition: Expression, body: Expression, breakCondition: string, maxIterations: number) 
  {
    super(DoExpression.id);
    this.condition = condition;
    this.body = body;
    this.breakCondition = breakCondition;
    this.maxIterations = maxIterations;
  }

  public getScope()
  {
    return {
      [this.breakCondition]: BooleanType.baseType
    };
  }

  public encode(): any 
  {
    return DoExpression.encode(this);
  }

}