
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { AndExpression } from './And';
import { isArray } from '../fns';
import { OrExpression } from './Or';
import { BooleanType } from '../types/Boolean';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';


const INDEX_EXPR = 1;

export class NotExpression extends Expression 
{

  public static STEP_NOT = 'not';

  public static id = 'not';

  public static decode(data: any[], exprs: ExpressionProvider): NotExpression 
  {
    const expression = exprs.getExpression(data[INDEX_EXPR]);
    
    return new NotExpression(expression);
  }

  public static encode(expr: NotExpression): any 
  {
    const expression = expr.expression.encode();

    return [this.id, expression];
  }

  public expression: Expression;

  public constructor(expression: Expression) 
  {
    super();
    this.expression = expression;
  }

  public getId(): string
  {
    return NotExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return this.expression.getComplexity(def);
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return NotExpression.encode(this);
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    return BooleanType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () =>
      traverse.step(NotExpression.STEP_NOT, this.expression)
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === NotExpression.STEP_NOT
      ? [1, this.expression]
      : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.expression.setParent(this);
  }

  public validate(def: Definitions, context: Type, handler: ValidationHandler): void
  {
    this.validateType(def, context, BooleanType.baseType, this.expression, handler);
  }

  public and(exprs: Expression | Expression[]): AndExpression
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new AndExpression([this as Expression].concat(append));
  }

  public or(exprs: Expression | Expression[]): OrExpression
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new OrExpression([this as Expression].concat(append));
  }

}