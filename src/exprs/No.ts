
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { NullType } from '../types/Null';


export class NoExpression extends Expression 
{

  public static id = 'noop';

  public static readonly instance = new NoExpression();

  public static decode(data: any[], exprs: ExpressionProvider): NoExpression 
  {
    return this.instance
  }

  public static encode(expr: NoExpression): any 
  {
    return [this.id];
  }

  public getId(): string
  {
    return NoExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return 0;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return NoExpression.encode(this);
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    return NullType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this);
  }

  public setParent(parent: Expression = null): void
  {
    
  }

  public validate(def: Definitions, context: Type, handler: ValidationHandler): void
  {
    
  }

}