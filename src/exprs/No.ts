
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
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

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return 0;
  }

  public isDynamic(): boolean
  {
    return false;
  }

  public getScope(): undefined
  {
    return undefined;
  }

  public encode(): any 
  {
    return NoExpression.encode(this);
  }

  public clone(): Expression
  {
    return this;
  }

  public getType(def: DefinitionProvider, context: Type): Type | undefined
  {
    return NullType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this);
  }

  public setParent(parent?: Expression): void
  {
    
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    
  }

  public mutates(def: DefinitionProvider, arg: string): boolean
  {
    return false;
  }

}