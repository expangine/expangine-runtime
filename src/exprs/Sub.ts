
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { isArray, isNumber } from '../fns';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { Exprs } from '../Exprs';


const INDEX_VALUE = 1;
const INDEX_PATH = 2;

export class SubExpression extends Expression 
{

  public static STEP_PATH = 'path';

  public static STEP_VALUE = 'value';

  public static id = 'sub';

  public static decode(data: any[], exprs: ExpressionProvider): SubExpression 
  {
    const value: Expression = exprs.getExpression(data[INDEX_VALUE]);
    const path: Expression[] = data[INDEX_PATH].map((part: any) => exprs.getExpression(part));

    return new SubExpression(value, path);
  }

  public static encode(expr: SubExpression): any 
  {
    const value = expr.value.encode();
    const path = expr.path.map(e => e.encode());

    return [this.id, value, path];
  }

  public static create(value: ExpressionValue, path: ExpressionValue[])
  {
    return new SubExpression(Exprs.parse(value), Exprs.parse(path));
  }

  public value: Expression;
  public path: Expression[];

  public constructor(value: Expression, path: Expression[]) 
  {
    super();
    this.value = value;
    this.path = path;
  }

  public getId(): string
  {
    return SubExpression.id;
  }

  public getComplexity(def: DefinitionProvider): number
  {
    return this.path.reduce((max, e) => Math.max(max, e.getComplexity(def)), this.value.getComplexity(def));
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return SubExpression.encode(this);
  }

  public clone(): Expression
  {
    return new SubExpression(this.value.clone(), this.path.map((p) => p.clone()));
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    const valueType = this.value.getType(def, context);

    return valueType
      ? def.getPathType(this.path, valueType)
      : null;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(SubExpression.STEP_VALUE, this.value, (replaceWith) => this.value = replaceWith);
      traverse.step(SubExpression.STEP_PATH, () => {
        this.path.forEach((expr, index) => 
          traverse.step(index, expr, (replaceWith) => this.path.splice(index, 1, replaceWith), () => this.path.splice(index, 1))
        )
      });
    });
  }

  // tslint:disable: no-magic-numbers
  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === SubExpression.STEP_PATH
      ? isNumber(steps[1]) && steps[1] < this.path.length
        ? [2, this.path[steps[1]]]
        : null
      : steps[0] === SubExpression.STEP_VALUE
        ? [1, this.value]
        : null;
  }
  // tslint:enable: no-magic-numbers

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.value.setParent(this);
    this.path.forEach(e => e.setParent(this));
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    const type = this.value.getType(def, context);

    this.validatePath(def, context, type, this.path, handler);

    this.value.validate(def, context, handler);
  }

  public with(expr: ExpressionValue): SubExpression
  {
    this.value = Exprs.parse(expr);
    this.value.setParent(this);

    return this;
  }

  public sub(expr: ExpressionValue | ExpressionValue[]): SubExpression
  {
    const append = isArray(expr)
      ? expr
      : [expr];

    for (const nodeValue of append)
    {
      const node = Exprs.parse(nodeValue);
      this.path.push(node);
      node.setParent(this);
    }

    return this;
  }

}