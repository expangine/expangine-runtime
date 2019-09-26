
import { objectMap, isEmpty, isArray, toExpr } from '../fns';
import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { Definitions } from '../Definitions';
import { Operation } from '../Operation';
import { AndExpression } from './And';
import { OrExpression } from './Or';
import { NotExpression } from './Not';
import { Type } from '../Type';


const INDEX_NAME = 1;
const INDEX_PARAMS = 2;
const INDEX_SCOPE = 3;

export class OperationExpression<P extends string = never, O extends string = never, S extends string = never> extends Expression 
{

  public static id = 'op';

  public static decode(data: any[], exprs: ExpressionProvider): OperationExpression 
  {
    const name = data[INDEX_NAME];
    const params: ExpressionMap = objectMap(data[INDEX_PARAMS], value => exprs.getExpression(value));
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

  public static create<P extends string, O extends string, S extends string>(
    op: Operation<P, O, S, any, any>, 
    params: Record<P, Expression> & Partial<Record<O, Expression>>,
    scopeAlias: Partial<Record<S, string>> = Object.create(null)
  ): OperationExpression<P, O, S> {
    return new OperationExpression<P, O, S>(op.id, params, scopeAlias);
  }

  public name: string;
  public params: ExpressionMap;
  public scopeAlias: Record<string, string>;

  public constructor(name: string, params: ExpressionMap, scopeAlias: Record<string, string> = {}) 
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
    const op = def.getOperation(this.name);
    let complexity = op ? op.complexity : 0;

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

  public getType(def: Definitions, context: Type): Type | null
  {
    return def.getOperationReturnType(this.name, this.params, this.scopeAlias, context);
  }

  public param(name: P | O, value: ExpressionValue): OperationExpression<P, O, S>
  {
    return new OperationExpression<P, O, S>(this.name, {
      ...this.params,
      [name]: toExpr(value),
    }, this.scopeAlias);
  }

  public alias(scoped: S, alias: string): OperationExpression<P, O, S>
  {
    return new OperationExpression<P, O, S>(this.name, this.params, {
      ...this.scopeAlias,
      [scoped]: alias
    });
  }

  public and(exprs: Expression | Expression[]): AndExpression
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new AndExpression([this as Expression].concat(append));
  }

  public or(exprs: Expression | Expression[]): OrExpression
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new OrExpression([this as Expression].concat(append));
  }

  public not(): NotExpression
  {
    return new NotExpression(this);
  }

}