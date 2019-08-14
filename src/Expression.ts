import { Type } from './Type';
import { Definitions } from './Definitions';


export interface ExpressionProvider 
{ 
  getExpression(value: any): Expression;
}

export interface ExpressionClass<T extends Expression = any> 
{
  id: string;
  decode(this: ExpressionClass<T>, data: any[], exprs: ExpressionProvider): T;
  encode(this: ExpressionClass<T>, expr: T): any;
  new(...args: any[]): T;
}

export abstract class Expression 
{

  public abstract getId(): string;

  public abstract getScope(): Record<string, Type> | null;

  public abstract getComplexity(def: Definitions): number;

  public abstract encode(): any;

}