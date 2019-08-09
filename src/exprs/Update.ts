
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { AnyType } from '../types/Any';


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

  public path: Expression[];
  public value: Expression;
  public currentVariable: string;

  public constructor(path: Expression[], value: Expression, currentVariable: string) 
  {
    super(UpdateExpression.id);
    this.path = path;
    this.value = value;
    this.currentVariable = currentVariable;
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

}