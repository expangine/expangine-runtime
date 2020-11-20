
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { isNumber } from '../fns';
import { BooleanType } from '../types/Boolean';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';


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

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return this.expressions.reduce((max, e) => Math.max(max, e.getComplexity(def, context)), 0);
  }

  public isDynamic(): boolean
  {
    return this.expressions.some((e) => e.isDynamic());
  }

  public getScope(): undefined
  {
    return undefined;
  }

  public encode(): any 
  {
    return AndExpression.encode(this);
  }

  public clone(): Expression
  {
    return new AndExpression(this.expressions.map(e => e.clone()));
  }

  public getType(def: DefinitionProvider, context: Type): Type | undefined
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

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | undefined
  {
    return isNumber(steps[0]) && steps[0] < this.expressions.length
      ? [1, this.expressions[steps[0]]]
      : undefined;
  }

  public setParent(parent?: Expression): void
  {
    this.parent = parent;

    this.expressions.forEach(e => e.setParent(this));
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    const expectedType = BooleanType.baseType;

    this.expressions.forEach(subject => 
    {
      this.validateType(def, context, expectedType, subject, handler);
    });
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    for (const expr of this.expressions)    
    {
      if (expr.mutates(def, arg, directly))
      {
        return true;
      }
    }

    return false;
  }

}