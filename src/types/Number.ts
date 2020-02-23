
import { isNumber, isEmpty, isWhole, coalesce, copy } from '../fns';
import { Type, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Exprs } from '../Exprs';
import { Expression } from '../Expression';
import { NumberOps, NumberOperations, NumberComputeds } from '../ops/NumberOps';
import { Definitions } from '../Definitions';
import { ID } from './ID';
import { Traverser } from '../Traverser';


const INDEX_OPTIONS = 1;
const RANDOM_MIN = 0;
const RANDOM_MAX = 10;

export interface NumberOptions 
{
  min?: number;
  max?: number;
  whole?: boolean;
}

export class NumberType extends Type<NumberOptions> 
{

  public static WHOLE_EPSILON = 0.000001;

  public static id = ID.Number;

  public static operations = NumberOperations;

  public static computeds = NumberComputeds;

  public static baseType = new NumberType({});

  public static decode(data: any[]): NumberType 
  {
    return new NumberType(data[INDEX_OPTIONS] || {});
  }

  public static encode(type: NumberType): any 
  {
    return isEmpty(type.options)
      ? this.id
      : [this.id, type.options];
  }

  public static describePriority: number = 4;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    if (!isNumber(data))
    {
      return null;
    }

    return new NumberType({
      min: data,
      max: data,
      whole: Math.abs(Math.floor(data) - data) <= NumberType.WHOLE_EPSILON
    });
  }

  public static registered: boolean = false;

  public static register(): void
  {

  }

  public getId(): string
  {
    return NumberType.id;
  }

  public getOperations()
  {
    return NumberType.operations.map;
  }

  public merge(type: NumberType): void
  {
    const o1 = this.options;
    const o2 = type.options;

    o1.max = Math.max(o1.max, o2.max);
    o1.min = Math.min(o1.min, o2.min);
    o1.whole = o1.whole && o2.whole;
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    return null;
  }

  public getSubTypes(def: Definitions): TypeSub[]
  {
    return [];
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public getSimplifiedType(): Type
  {
    return this;
  }

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean 
  {
    if (!(other instanceof NumberType))
    {
      return false;
    }

    if (options.value)
    {
      const min = this.options.min;
      const otherMin = other.options.min;

      if (isNumber(min) && (!isNumber(otherMin) || otherMin < min))
      {
        return false;
      }

      const max = this.options.max;
      const otherMax = other.options.max;

      if (isNumber(max) && (!isNumber(otherMax) || otherMax < max))
      {
        return false;
      }
    }

    return true;
  }

  public isOptional(): boolean
  {
    return false;
  }

  public isSimple(): boolean
  {
    return true;
  }
  
  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this);
  }

  public setParent(parent: Type = null): void
  {
    this.parent = parent;
  }

  public removeDescribedRestrictions(): void
  {
    this.options = {};
  }

  public getCreateExpression(): Expression
  {
    return Exprs.op(NumberOps.create, {});
  }

  public getValidateExpression(): Expression
  {
    return Exprs.op(NumberOps.isValid, {
      value: Exprs.get('value'),
    });
  }

  public getCompareExpression(): Expression
  {
    return Exprs.op(NumberOps.cmp, {
      value: Exprs.get('value'),
      test: Exprs.get('test'),
    });
  }

  public isValid(value: any): boolean 
  {
    if (!isNumber(value))
    {
      return false;
    }

    const { min, max, whole } = this.options;

    if (isNumber(min) && value < min)
    {
      return false;
    }

    if (isNumber(max) && value > max)
    {
      return false;
    }

    if (whole && !isWhole(value))
    {
      return false;
    }

    return true;
  }

  public normalize(value: any): any
  {
    return value;
  }

  public newInstance(): NumberType
  {
    return new NumberType({});
  }

  public clone(): NumberType
  {
    return new NumberType(copy(this.options));
  }

  public encode(): any 
  {
    return NumberType.encode(this);
  }

  public create(): number
  {
    return 0;
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const { min, max, whole } = this.options;
    const chosenMin = coalesce(min, RANDOM_MIN);
    const chosenMax = coalesce(max, RANDOM_MAX);

    return rnd(chosenMin, chosenMax, whole);
  }

  public fromJson(json: number): number
  {
    return json;
  }

  public toJson(value: number): number
  {
    return value;
  }

}