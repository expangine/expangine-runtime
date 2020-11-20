
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { PathExpression } from './Path';


const INDEX_PATH = 1;

export class GetExpression extends Expression 
{

  public static id = 'get';

  public static decode(data: any[], exprs: ExpressionProvider): GetExpression 
  {
    if (data[INDEX_PATH])
    {
      const path: Expression[] = data[INDEX_PATH].map((part: any) => exprs.getExpression(part));

      exprs.setLegacy();

      return PathExpression.createForLegacy([new GetExpression(), ...path]);
    }
    
    return new GetExpression();
  }

  public static encode(expr: GetExpression): any 
  {
    return [this.id];
  }

  public getId(): string
  {
    return GetExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return 0;
  }

  public getScope(): undefined
  {
    return undefined;
  }

  public encode(): any 
  {
    return GetExpression.encode(this);
  }

  public clone(): Expression
  {
    return new GetExpression();
  }

  public getType(def: DefinitionProvider, context: Type): Type | undefined
  {
    return context;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this);
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | undefined
  {
    return undefined;
  }

  public setParent(parent?: Expression): void
  {
    this.parent = parent;
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    
  }

  public mutates(def: DefinitionProvider, arg: string): boolean
  {
    return false;
  }

  public isPathStart(): boolean
  {
    return true;
  }

  public isPathNode(): boolean
  {
    return true;
  }

}