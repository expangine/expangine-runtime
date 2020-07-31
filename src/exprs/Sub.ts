import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { PathExpression } from './Path';



const INDEX_VALUE = 1;
const INDEX_PATH = 2;

export class SubExpression extends Expression 
{

  public static id = 'sub';

  public static decode(data: any[], exprs: ExpressionProvider): SubExpression 
  {
    const value: Expression = exprs.getExpression(data[INDEX_VALUE]);
    const path: Expression[] = data[INDEX_PATH].map((part: any) => exprs.getExpression(part));

    exprs.setLegacy();

    return PathExpression.createForLegacy([value, ...path]);
  }

  public static encode(expr: SubExpression): any 
  {
    throw new Error('Sub expression is no longer supported.');
  }

  public getId(): string
  {
    throw new Error('Sub expression is no longer supported.');
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    throw new Error('Sub expression is no longer supported.');
  }

  public getScope(): null
  {
    throw new Error('Sub expression is no longer supported.');
  }

  public encode(): any 
  {
    throw new Error('Sub expression is no longer supported.');
  }

  public clone(): Expression
  {
    throw new Error('Sub expression is no longer supported.');
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    throw new Error('Sub expression is no longer supported.');
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    throw new Error('Sub expression is no longer supported.');
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    throw new Error('Sub expression is no longer supported.');
  }

  public setParent(parent: Expression = null): void
  {
    throw new Error('Sub expression is no longer supported.');
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    throw new Error('Sub expression is no longer supported.');
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    throw new Error('Sub expression is no longer supported.');
  }

}