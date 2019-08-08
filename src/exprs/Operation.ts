
import { mapObject, isEmpty } from '../fns';
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';


const INDEX_NAME = 1;
const INDEX_PARAMS = 2;
const INDEX_SCOPE = 3;

export class OperationExpression extends Expression 
{

  public static id = 'op';

  public static decode(data: any[], exprs: ExpressionProvider): OperationExpression 
  {
    const name = data[INDEX_NAME];
    const params: Record<string, Expression> = mapObject(data[INDEX_PARAMS], value => exprs.getExpression(value));
    const scopeAlias: Record<string, string> = data[INDEX_SCOPE] || {};
    
    return new OperationExpression(name, params, scopeAlias);
  }

  public static encode(expr: OperationExpression): any 
  {
    const params = mapObject(expr.params, e => e.encode());

    return isEmpty(expr.scopeAlias)
      ? [this.id, expr.name, params]
      : [this.id, expr.name, params, expr.scopeAlias]
  }

  public name: string;
  public params: Record<string, Expression>;
  public scopeAlias: Record<string, string>;

  public constructor(name: string, params: Record<string, Expression>, scopeAlias: Record<string, string>) 
  {
    super(OperationExpression.id);
    this.name = name;
    this.params = params;
    this.scopeAlias = scopeAlias;
  }

  public getComplexity(def: Definitions): number
  {
    const builder = def.getOperationBuilder(this.name);
    let complexity = builder ? builder.complexity : 0;

    for (const prop in this.params)
    {
      complexity = Math.max(complexity, this.params[prop].getComplexity(def));
    }

    return complexity;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return OperationExpression.encode(this);
  }

}