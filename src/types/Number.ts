
import { isNumber, isEmpty } from '../fns';
import { Type, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';


const INDEX_OPTIONS = 1;

export interface NumberOptions 
{
  min?: number;
  max?: number;
  whole?: boolean;
}

export class NumberType extends Type<NumberOptions> 
{

  public static WHOLE_EPSILON = 0.000001;

  public static id = 'num';

  public static operations = new Operations<NumberType>('num:');

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

  public merge(type: NumberType, describer: TypeDescribeProvider): void
  {
    const o1 = this.options;
    const o2 = type.options;

    o1.max = Math.max(o1.max, o2.max);
    o1.min = Math.min(o1.min, o2.min);
    o1.whole = o1.whole && o2.whole;
  }

  public getSubTypes(): null
  {
    return null;
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    return other instanceof NumberType;
  }

  public isValid(value: any): boolean 
  {
    return isNumber(value);
  }

  public normalize(value: any): any
  {
    return value;
  }

  public encode(): any 
  {
    return NumberType.encode(this);
  }

}