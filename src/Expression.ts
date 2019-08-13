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

  public id: string;

  public constructor(id: string) 
  {
    this.id = id;
  }

  abstract getScope(): Record<string, Type> | null;

  abstract getComplexity(def: Definitions): number;

  abstract encode(): any;

}