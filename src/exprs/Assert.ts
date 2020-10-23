
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { BooleanType } from '../types/Boolean';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { NoExpression } from './No';
import { NullType } from '../types/Null';
import { TextType } from '../types/Text';


const INDEX_CONDITION = 1;
const INDEX_MESSAGE = 2;

export class AssertExpression extends Expression 
{

  public static STEP_CONDITION = 'condition';
  public static STEP_MESSAGE = 'message';

  public static id = 'assert';

  public static decode(data: any[], exprs: ExpressionProvider): AssertExpression 
  {
    const condition = exprs.getExpression(data[INDEX_CONDITION]);
    const message = exprs.getExpression(data[INDEX_MESSAGE]) || NoExpression.instance;
    
    return new AssertExpression(condition, message);
  }

  public static encode(expr: AssertExpression): any 
  {
    return expr.message === NoExpression.instance
      ? [this.id, expr.condition.encode()]
      : [this.id, expr.condition.encode(), expr.message.encode()];
  }

  public condition: Expression;
  public message: Expression;

  public constructor(condition: Expression, message: Expression = NoExpression.instance) 
  {
    super();
    this.condition = condition;
    this.message = message;
  }

  public getId(): string
  {
    return AssertExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return this.condition.getComplexity(def, context);
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return AssertExpression.encode(this);
  }

  public clone(): Expression
  {
    return new AssertExpression(this.condition.clone(), this.message.clone());
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return NullType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(AssertExpression.STEP_CONDITION, this.condition, (replaceWith) => this.condition = replaceWith);
      traverse.step(AssertExpression.STEP_MESSAGE, this.message, (replaceWith) => this.message = replaceWith);
    });
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === AssertExpression.STEP_CONDITION
      ? [1, this.condition]
      : steps[0] === AssertExpression.STEP_MESSAGE
        ? [1, this.message]
        : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.condition.setParent(this);
    this.message.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    this.validateType(def, context, BooleanType.baseType, this.condition, handler);

    if (this.message !== NoExpression.instance) {
      this.validateType(def, context, TextType.baseType, this.message, handler);
    }
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    return this.condition.mutates(def, arg, directly) || this.message.mutates(def, arg, directly);
  }

}