
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { TupleType } from '../types/Tuple';
import { ValidationHandler } from '../Validate';
import { isNumber } from '../fns';
import { Types } from '../Types';


const INDEX_EXPRESSIONS = 1;

export class TupleExpression extends Expression 
{

  public static id = 'tuple';

  public static decode(data: any[], exprs: ExpressionProvider): TupleExpression 
  {
    const expressions = data[INDEX_EXPRESSIONS].map((d: any) => exprs.getExpression(d));
    
    return new TupleExpression(expressions);
  }

  public static encode(expr: TupleExpression): any 
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
    return TupleExpression.id;
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
    return TupleExpression.encode(this);
  }

  public clone(): Expression
  {
    return new TupleExpression(this.expressions.map((e) => e.clone()));
  }

  public getType(def: DefinitionProvider, context: Type): Type | undefined
  {
    const elements = this.expressions
      .map((e) => Types.simplify(e.getType(def, context)))
      .filter((e) => !!e)
    ;

    return new TupleType(elements as Type[]);
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
    this.expressions.forEach(subject =>
    {
      subject.validate(def, context, handler);
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