
import { objectMap, objectReduce, objectEach } from '../fns';
import { Expression, ExpressionProvider, ExpressionMap } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ObjectType } from '../types/Object';
import { ValidationHandler } from '../Validate';
import { Types } from '../Types';
import { DataTypes } from '../DataTypes';


const INDEX_PROPS = 1;

export class ObjectExpression extends Expression 
{

  public static id = 'obj';

  public static decode(data: any[], exprs: ExpressionProvider): ObjectExpression 
  {
    const props = objectMap(data[INDEX_PROPS], e => exprs.getExpression(e));
    
    return new ObjectExpression(props);
  }

  public static encode(expr: ObjectExpression): any 
  {
    const props = objectMap(expr.props, e => e.encode());

    return [this.id, props];
  }

  public props: ExpressionMap;

  public constructor(props: ExpressionMap) 
  {
    super();
    this.props = props;
  }

  public getId(): string
  {
    return ObjectExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return objectReduce(this.props, (e, k, max) => Math.max(max, e.getComplexity(def, context)), 0);
  }

  public isDynamic(): boolean
  {
    for (const prop in this.props)
    {
      const propExpr = this.props[prop];

      if (propExpr && propExpr.isDynamic())
      {
        return true;
      }
    }

    return false;
  }

  public getScope(): undefined
  {
    return undefined;
  }

  public encode(): any 
  {
    return ObjectExpression.encode(this);
  }

  public clone(): Expression
  {
    return new ObjectExpression(objectMap(this.props, (p) => p.clone()));
  }

  public getType(def: DefinitionProvider, context: Type): Type | undefined
  {
    return new ObjectType({ props: objectMap(this.props, e => Types.simplify(e.getType(def, context))) });
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => 
      objectEach(this.props, (expr, prop) =>
        traverse.step(prop, expr, (replaceWith) => this.props[prop] = replaceWith, () => DataTypes.objectRemove(this.props, prop))
      )
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | undefined
  {
    return steps[0] in this.props
      ? [1, this.props[steps[0]]]
      : undefined;
  }

  public setParent(parent?: Expression): void
  {
    this.parent = parent;

    objectEach(this.props, e => e.setParent(this));
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    objectEach(this.props, e => e.validate(def, context, handler));
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    for (const prop in this.props)
    {
      if (this.props[prop].mutates(def, arg, directly))
      {
        return true;
      }
    }

    return false;
  }

}