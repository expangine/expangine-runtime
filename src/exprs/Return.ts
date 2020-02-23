
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';


const INDEX_VALUE = 1;

export class ReturnExpression extends Expression 
{

  public static STEP_VALUE = 'value';

  public static id = 'return';

  public static decode(data: any[], exprs: ExpressionProvider): ReturnExpression 
  {
    const value = exprs.getExpression(data[INDEX_VALUE]);
    
    return new ReturnExpression(value);
  }

  public static encode(expr: ReturnExpression): any 
  {
    const returnValue = expr.value.encode();

    return returnValue !== undefined
      ? [this.id, returnValue]
      : [this.id];
  }

  public value: Expression;

  public constructor(value: Expression) 
  {
    super();
    this.value = value;
  }

  public getId(): string
  {
    return ReturnExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return this.value.getComplexity(def);
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return ReturnExpression.encode(this);
  }

  public clone(): Expression
  {
    return new ReturnExpression(this.value.encode());
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    return this.value 
      ? this.value.getType(def, context)
      : null;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => 
      traverse.step(ReturnExpression.STEP_VALUE, this.value, (replaceWith) => this.value = replaceWith)
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === ReturnExpression.STEP_VALUE
      ? [1, this.value]
      : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.value.setParent(this);
  }

  public validate(def: Definitions, context: Type, handler: ValidationHandler): void
  {
    this.value.validate(def, context, handler);
  }

}