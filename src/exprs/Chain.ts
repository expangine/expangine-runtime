
import { Expression, ExpressionProvider } from '../Expression';


const INDEX_CHAIN = 1;

export class ChainExpression extends Expression 
{

  public static id = 'chain';

  public static decode(data: any[], exprs: ExpressionProvider): ChainExpression 
  {
    const chain = data[INDEX_CHAIN].map((d: any) => exprs.getExpression(d));

    return new ChainExpression(chain);
  }

  public static encode(expr: ChainExpression): any 
  {
    const chain = expr.chain.map(e => e.encode());

    return [this.id, chain];
  }

  public chain: Expression[];

  public constructor(chain: Expression[]) 
  {
    super(ChainExpression.id);
    this.chain = chain;
  }

  public encode(): any 
  {
    return ChainExpression.encode(this);
  }

}