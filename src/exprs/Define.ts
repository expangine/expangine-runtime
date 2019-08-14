
import { Expression, ExpressionProvider } from '../Expression';
import { objectMap } from '../fns';
import { AnyType } from '../types/Any';
import { Definitions } from '../Definitions';


const INDEX_DEFINE = 1;
const INDEX_BODY = 2;

export class DefineExpression extends Expression 
{

  public static id = 'def';

  public static decode(data: any[], exprs: ExpressionProvider): DefineExpression 
  {
    const define = objectMap(data[INDEX_DEFINE], (d: any) => exprs.getExpression(d));
    const body = exprs.getExpression(data[INDEX_BODY]);
    
    return new DefineExpression(define, body);
  }

  public static encode(expr: DefineExpression): any 
  {
    const define = objectMap(expr.define, e => e.encode());

    return [this.id, define, expr.body.encode()];
  }

  public define: Record<string, Expression>;
  public body: Expression;

  public constructor(define: Record<string, Expression>, body: Expression) 
  {
    super();
    this.define = define;
    this.body = body;
  }

  public getId(): string
  {
    return DefineExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    let complexity = this.body.getComplexity(def);

    for (const prop in this.define)
    {
      complexity = Math.max(complexity, this.define[prop].getComplexity(def));
    }

    return complexity;
  }

  public getScope()
  {
    return objectMap(this.define, () => AnyType.baseType);
  }

  public encode(): any 
  {
    return DefineExpression.encode(this);
  }

}