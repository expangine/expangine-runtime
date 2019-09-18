
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
import { AnyType } from '../types/Any';
import { toExpr, isArray } from '../fns';


const DEFAULT_CURRENT = 'current';
const INDEX_PATH = 1;
const INDEX_VALUE = 2;
const INDEX_CURRENT = 3;

export class UpdateExpression extends Expression 
{

  public static id = 'up';

  public static decode(data: any[], exprs: ExpressionProvider): UpdateExpression 
  {
    const path: Expression[] = data[INDEX_PATH].map((part: any) => exprs.getExpression(part));
    const value = exprs.getExpression(data[INDEX_VALUE]);
    const currentVariable = data[INDEX_CURRENT] || DEFAULT_CURRENT;

    return new UpdateExpression(path, value, currentVariable);
  }

  public static encode(expr: UpdateExpression): any 
  {
    const path = expr.path.map(e => e.encode());
    const value = expr.value.encode();

    return expr.currentVariable === DEFAULT_CURRENT
      ? [this.id, path, value]
      : [this.id, path, value, expr.currentVariable]
  }

  public static create(path: ExpressionValue[], value: ExpressionValue, currentVariable: string = DEFAULT_CURRENT)
  {
    return new UpdateExpression(toExpr(path), toExpr(value), currentVariable);
  }

  public path: Expression[];
  public value: Expression;
  public currentVariable: string;

  public constructor(path: Expression[], value: Expression, currentVariable: string = DEFAULT_CURRENT) 
  {
    super();
    this.path = path;
    this.value = value;
    this.currentVariable = currentVariable;
  }

  public getId(): string
  {
    return UpdateExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return this.path.reduce((max, e) => Math.max(max, e.getComplexity(def)), this.value.getComplexity(def));
  }

  public getScope()
  {
    return {
      [this.currentVariable]: AnyType.baseType
    };
  }

  public encode(): any 
  {
    return UpdateExpression.encode(this);
  }

  public add(expr: ExpressionValue | ExpressionValue[]): UpdateExpression
  {
    const append = isArray(expr)
      ? expr
      : [expr];

    return new UpdateExpression(this.path.concat(toExpr(append)), this.value, this.currentVariable);
  }

  public to(value: ExpressionValue, currentVariable?: string): UpdateExpression
  {
    return new UpdateExpression(this.path, toExpr(value), currentVariable || this.currentVariable);
  }

  public withVariable(name: string): UpdateExpression
  {
    return new UpdateExpression(this.path, this.value, name);
  }

}