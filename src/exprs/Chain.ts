
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { isArray, isNumber } from '../fns';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';


const INDEX_CHAIN = 1;

export class ChainExpression extends Expression 
{

  public static id = 'chain';

  public static decode(data: any[], exprs: ExpressionProvider): ChainExpression 
  {
    const chain = data[INDEX_CHAIN].map((d: any) => exprs.getExpression(d));

    return new ChainExpression(chain);
  }

  public static encode(expr: ChainExpression): any 
  {
    const chain = expr.chain.map(e => e.encode());

    return [this.id, chain];
  }

  public chain: Expression[];

  public constructor(chain: Expression[]) 
  {
    super();
    this.chain = chain;
  }

  public getId(): string
  {
    return ChainExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return this.chain.reduce((max, e) => Math.max(max, e.getComplexity(def)), 0);
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return ChainExpression.encode(this);
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    return this.chain[this.chain.length - 1].getType(def, context);
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => 
      this.chain.forEach((expr, index) => 
        traverse.step(index, expr)
      )
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return isNumber(steps[0]) && steps[0] < this.chain.length
      ? [1, this.chain[steps[0]]]
      : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.chain.forEach(e => e.setParent(this));
  }

  public validate(def: Definitions, context: Type, handler: ValidationHandler): void
  {
    this.chain.forEach(subject => 
    {
      subject.validate(def, context, handler);
    });
  }

  public add(exprs: Expression | Expression[]): ChainExpression
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new ChainExpression(this.chain.concat(append));
  }

}