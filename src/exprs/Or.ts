
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { isNumber } from '../fns';
import { Type } from '../Type';
import { BooleanType } from '../types/Boolean';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { Types } from '../Types';
import { NullType } from '../types/Null';


const INDEX_EXPRESSIONS = 1;

export class OrExpression extends Expression 
{

  public static id = 'or';

  public static decode(data: any[], exprs: ExpressionProvider): OrExpression 
  {
    const expressions = data[INDEX_EXPRESSIONS].map((d: any) => exprs.getExpression(d));
    
    return new OrExpression(expressions);
  }

  public static encode(expr: OrExpression): any 
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
    return OrExpression.id;
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
    return OrExpression.encode(this);
  }

  public clone(): Expression
  {
    return new OrExpression(this.expressions.map((e) => e.clone()));
  }

  public getType(def: DefinitionProvider, context: Type): Type | undefined
  {
    const types = this.expressions
      .map(e => e.getType(def, context))
      .concat(BooleanType.baseType)
      .filter(t => !!t)
    ;
    
    return Types.mergeMany(types as Type[], NullType.baseType);
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