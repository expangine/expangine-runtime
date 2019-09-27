import { Type, TypeMap } from './Type';
import { Definitions } from './Definitions';
import { Traversable, Traverser } from './Traverser';


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

export type ExpressionValue = any | Expression;

export type ExpressionMap = Record<string, Expression>;

export abstract class Expression implements Traversable<Expression>
{

  public parent?: Expression;
  
  public abstract getId(): string;

  public abstract getScope(): TypeMap | null;

  public abstract getComplexity(def: Definitions): number;

  public abstract encode(): any;

  public abstract getType(def: Definitions, context: Type): Type | null;

  public abstract traverse<R>(traverse: Traverser<Expression, R>): R;

  public abstract setParent(parent?: Expression): void;

}