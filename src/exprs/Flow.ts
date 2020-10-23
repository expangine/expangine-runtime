
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';


const INDEX_TYPE = 1;
const INDEX_VALUE = 2;


export enum FlowType
{
  CONTINUE = 'continue',
  BREAK = 'break',
  RETURN = 'return',
  EXIT = 'exit'
}

export class FlowExpression extends Expression 
{

  public static STEP_VALUE = 'value';

  public static id = 'flow';

  public static decode(data: any[], exprs: ExpressionProvider): FlowExpression 
  {
    const type = data[INDEX_TYPE];
    const value = exprs.getExpression(data[INDEX_VALUE]);
    
    return new FlowExpression(type, value);
  }

  public static encode(expr: FlowExpression): any 
  {
    const returnValue = expr.value.encode();

    return returnValue !== undefined
      ? [this.id, expr.type, returnValue]
      : [this.id, expr.type];
  }

  public type: FlowType;
  public value: Expression;

  public constructor(type: FlowType, value: Expression) 
  {
    super();
    this.type = type;
    this.value = value;
  }

  public getId(): string
  {
    return FlowExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return this.value.getComplexity(def, context);
  }

  public isDynamic(): boolean
  {
    return this.value.isDynamic();
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return FlowExpression.encode(this);
  }

  public clone(): Expression
  {
    return new FlowExpression(this.type, this.value.encode());
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return this.value 
      ? this.value.getType(def, context)
      : null;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => 
      traverse.step(FlowExpression.STEP_VALUE, this.value, (replaceWith) => this.value = replaceWith)
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === FlowExpression.STEP_VALUE
      ? [1, this.value]
      : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.value.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    this.value.validate(def, context, handler);
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    return this.value.mutates(def, arg, directly);
  }

  public isPathWritable(defs: DefinitionProvider): boolean
  {
    return false;
  }

}