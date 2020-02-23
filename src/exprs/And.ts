
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { isArray, isNumber } from '../fns';
import { BooleanType } from '../types/Boolean';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { OrExpression } from './Or';


const INDEX_EXPRESSIONS = 1;

export class AndExpression extends Expression 
{

  public static id = 'and';

  public static decode(data: any[], exprs: ExpressionProvider): AndExpression 
  {
    const expressions = data[INDEX_EXPRESSIONS].map((d: any) => exprs.getExpression(d));
    
    return new AndExpression(expressions);
  }

  public static encode(expr: AndExpression): any 
  {
    const expressions = expr.expressions.map(e => e.encode());

    return [this.id, expressions];
  }

  public expressions: Expression[];

  public constructor(expressions: Expression[]) 
  {
    super();
    this.expressions = expressions;
  }

  public getId(): string
  {
    return AndExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return this.expressions.reduce((max, e) => Math.max(max, e.getComplexity(def)), 0);
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return AndExpression.encode(this);
  }

  public clone(): Expression
  {
    return new AndExpression(this.expressions.map(e => e.clone()));
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    return BooleanType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => 
      this.expressions.forEach((expr, index) => 
        traverse.step(index, expr, (replaceWith) => this.expressions.splice(index, 1, replaceWith), () => this.expressions.splice(index, 1))
      )
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return isNumber(steps[0]) && steps[0] < this.expressions.length
      ? [1, this.expressions[steps[0]]]
      : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.expressions.forEach(e => e.setParent(this));
  }

  public validate(def: Definitions, context: Type, handler: ValidationHandler): void
  {
    const expectedType = BooleanType.baseType;

    this.expressions.forEach(subject => 
    {
      this.validateType(def, context, expectedType, subject, handler);
    });
  }

  public and(exprs: Expression | Expression[])
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new AndExpression(this.expressions.concat(append));
  }

  public or(exprs: Expression | Expression[])
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new OrExpression([this as Expression].concat(append));
  }

}