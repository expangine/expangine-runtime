
import { objectMap, isEmpty } from '../fns';
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { TypeMap } from '../Type';
import { OperationBuilder } from '../Operation';


const INDEX_NAME = 1;
const INDEX_PARAMS = 2;
const INDEX_SCOPE = 3;

export class OperationExpression extends Expression 
{

  public static id = 'op';

  public static decode(data: any[], exprs: ExpressionProvider): OperationExpression 
  {
    const name = data[INDEX_NAME];
    const params: Record<string, Expression> = objectMap(data[INDEX_PARAMS], value => exprs.getExpression(value));
    const scopeAlias: Record<string, string> = data[INDEX_SCOPE] || {};
    
    return new OperationExpression(name, params, scopeAlias);
  }

  public static encode(expr: OperationExpression): any 
  {
    const params = objectMap(expr.params, e => e.encode());

    return isEmpty(expr.scopeAlias)
      ? [this.id, expr.name, params]
      : [this.id, expr.name, params, expr.scopeAlias]
  }

  public static create<P extends TypeMap, O extends TypeMap, S extends TypeMap>(
    op: OperationBuilder<any, any, P, O, S>, 
    params: Record<keyof P, Expression> & Partial<Record<keyof O, Expression>>,
    scopeAlias: Partial<Record<keyof S, string>> = {}
  ): OperationExpression {
    return new OperationExpression(op.id, params, scopeAlias);
  }

  public name: string;
  public params: Record<string, Expression>;
  public scopeAlias: Record<string, string>;

  public constructor(name: string, params: Record<string, Expression>, scopeAlias: Record<string, string> = {}) 
  {
    super();
    this.name = name;
    this.params = params;
    this.scopeAlias = scopeAlias;
  }

  public getId(): string
  {
    return OperationExpression.id;
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