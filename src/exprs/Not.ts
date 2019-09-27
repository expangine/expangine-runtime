
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { AndExpression } from './And';
import { isArray } from '../fns';
import { OrExpression } from './Or';
import { BooleanType } from '../types/Boolean';
import { Type } from '../Type';
import { Traverser } from '../Traverser';


const INDEX_EXPR = 1;

export class NotExpression extends Expression 
{

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
      traverse.step('not', this.expression)
    );
  }

  public setParent(parent?: Expression): void
  {
    this.parent = parent;

    this.expression.setParent(this);
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