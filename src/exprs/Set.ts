
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { isArray, isNumber } from '../fns';
import { BooleanType } from '../types/Boolean';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { Exprs } from '../Exprs';


const INDEX_PATH = 1;
const INDEX_VALUE = 2;

export class SetExpression extends Expression 
{

  public static STEP_PATH = 'path';

  public static STEP_VALUE = 'value';

  public static id = 'set';

  public static decode(data: any[], exprs: ExpressionProvider): SetExpression 
  {
    const path: Expression[] = data[INDEX_PATH].map((part: any) => exprs.getExpression(part));
    const value = exprs.getExpression(data[INDEX_VALUE]);

    return new SetExpression(path, value);
  }

  public static encode(expr: SetExpression): any 
  {
    const path = expr.path.map(e => e.encode());

    return [this.id, path, expr.value.encode()];
  }

  public static create(path: ExpressionValue[], value: ExpressionValue)
  {
    return new SetExpression(Exprs.parse(path), Exprs.parse(value));
  }

  public path: Expression[];
  public value: Expression;

  public constructor(path: Expression[], value: Expression) 
  {
    super();
    this.path = path;
    this.value = value;
  }

  public getId(): string
  {
    return SetExpression.id;
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
    return SetExpression.encode(this);
  }

  public clone(): Expression
  {
    return new SetExpression(this.path.map((p) => p.clone()), this.value.clone());
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return BooleanType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(SetExpression.STEP_PATH, () => 
        this.path.forEach((expr, index) => 
          traverse.step(index, expr, (replaceWith) => this.path.splice(index, 1, replaceWith), () => this.path.splice(index, 1))
        )
      );
      traverse.step(SetExpression.STEP_VALUE, this.value, (replaceWith) => this.value = replaceWith);
    });
  }

  // tslint:disable: no-magic-numbers
  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === SetExpression.STEP_PATH
      ? isNumber(steps[1]) && steps[1] < this.path.length
        ? [2, this.path[steps[1]]]
        : null
      : steps[0] === SetExpression.STEP_VALUE
        ? [1, this.value]
        : null;
  }
  // tslint:enable: no-magic-numbers

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.path.forEach(e => e.setParent(this));
    this.value.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    this.validatePath(def, context, context, this.path, handler);

    const expectedType = def.getPathType(this.path, context);

    if (expectedType)
    {
      this.validateType(def, context, expectedType, this.value, handler);
    }
  }

  public add(expr: ExpressionValue | ExpressionValue[]): SetExpression
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

  public to(value: ExpressionValue): SetExpression
  {
    this.value = Exprs.parse(value);
    this.value.setParent(this);

    return this;
  }

}