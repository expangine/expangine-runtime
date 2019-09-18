
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { isArray } from '../fns';
import { OrExpression } from './Or';


const INDEX_EXPRESSIONS = 1;

export class AndExpression extends Expression 
{

  public static id = 'and';

  public static decode(data: any[], exprs: ExpressionProvider): AndExpression 
  {
    const expressions = data[INDEX_EXPRESSIONS].map((d: any) => exprs.getExpression(d));
    
    return new AndExpression(expressions);
  }

  public static encode(expr: AndExpression): any 
  {
    const expressions = expr.expressions.map(e => e.encode());

    return [this.id, expressions];
  }

  public expressions: Expression[];

  public constructor(expressions: Expression[]) 
  {
    super();
    this.expressions = expressions;
  }

  public getId(): string
  {
    return AndExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return this.expressions.reduce((max, e) => Math.max(max, e.getComplexity(def)), 0);
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return AndExpression.encode(this);
  }

  public and(exprs: Expression | Expression[]): AndExpression
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new AndExpression(this.expressions.concat(append));
  }

  public or(exprs: Expression | Expression[]): OrExpression
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new OrExpression([this as Expression].concat(append));
  }

}