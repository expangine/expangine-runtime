
import { isArray, isString, isNumber } from '../fns';
import { Expression, ExpressionProvider } from '../Expression';
import { Type } from '../Type';
import { Definitions } from '../Definitions';
import { EnumType } from '../types/Enum';
import { TextType } from '../types/Text';
import { NumberType } from '../types/Number';
import { Traverser } from '../Traverser';
import { AnyType } from '../types/Any';


const INDEX_CONSTANT = 1;

export class ConstantExpression extends Expression 
{

  public static has(e: Expression, constant: any): boolean
  {
    return e instanceof ConstantExpression && e.value === constant;
  }

  public static is(e: Expression): e is ConstantExpression
  {
    return e instanceof ConstantExpression;
  }

  public static id = 'constant';

  public static decode(data: any[], expr: ExpressionProvider): ConstantExpression 
  {
    const value = AnyType.baseType.fromJson(data[INDEX_CONSTANT])

    return new ConstantExpression(value);
  }

  public static encode(expr: ConstantExpression): any 
  {
    const value = AnyType.baseType.toJson(expr.value);

    return isArray(value)
      ? [this.id, value]
      : value;
  }

  public value: any;

  public constructor(value: any) 
  {
    super();
    this.value = value;
  }

  public getId(): string
  {
    return ConstantExpression.id;
  }

  public getComplexity(): number
  {
    return 0;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return ConstantExpression.encode(this);
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    const value = this.value;

    if (isString(value)) 
    {
      return new EnumType({
        key: TextType.baseType.newInstance(),
        value: TextType.baseType.newInstance(),
        constants: new Map([[value, value]]),
      });
    }

    if (isNumber(value)) 
    {
      return new EnumType({
        key: NumberType.baseType.newInstance(),
        value: NumberType.baseType.newInstance(),
        constants: new Map([[value, value]]),
      });
    }

    const described = def.describe(this.value);

    if (described)
    {
      described.removeDescribedRestrictions();
    }

    return described;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this);
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;
  }

}