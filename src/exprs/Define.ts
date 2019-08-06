
import { Expression, ExpressionProvider } from '../Expression';
import { mapObject } from '../fns';


const INDEX_DEFINE = 1;
const INDEX_BODY = 2;

export class DefineExpression extends Expression 
{

  public static id = 'def';

  public static decode(data: any[], exprs: ExpressionProvider): DefineExpression 
  {
    const define = mapObject(data[INDEX_DEFINE], (d: any) => exprs.getExpression(d));
    const body = exprs.getExpression(data[INDEX_BODY]);
    
    return new DefineExpression(define, body);
  }

  public static encode(expr: DefineExpression): any 
  {
    const define = mapObject(expr.define, e => e.encode());

    return [this.id, define, expr.body.encode()];
  }

  public define: Record<string, Expression>;
  public body: Expression;

  public constructor(define: Record<string, Expression>, body: Expression) 
  {
    super(DefineExpression.id);
    this.define = define;
    this.body = body;
  }

  public encode(): any 
  {
    return DefineExpression.encode(this);
  }

}