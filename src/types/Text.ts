
import { isString, isNumber, isEmpty } from '../fns';
import { Type, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';


const INDEX_OPTIONS = 1;

export interface TextOptions 
{
  min?: number;
  max?: number;
  requireUpper?: boolean;
  requireLower?: boolean;
  forceUpper?: boolean;
  forceLower?: boolean;
  matches?: RegExp;
}

export class TextType extends Type<TextOptions> 
{

  public static id = 'text';

  public static operations = new Operations<TextType>('text:');
  
  public static baseType = new TextType({});

  public static decode(data: any[]): TextType 
  {
    return new TextType(data[INDEX_OPTIONS] || {});
  }

  public static encode(type: TextType): any 
  {
    return isEmpty(type.options)
      ? this.id
      : [this.id, type.options];
  }

  public static describePriority: number = 3;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    if (!isString(data))
    {
      return null;
    }

    return new TextType({
      min: data.length,
      max: data.length,
      requireLower: data.toLowerCase() === data,
      requireUpper: data.toUpperCase() === data
    });
  }

  public merge(type: TextType, describer: TypeDescribeProvider): void
  {
    const o1 = this.options;
    const o2 = type.options;

    o1.max = Math.max(o1.max, o2.max);
    o1.min = Math.min(o1.min, o2.min);
    o1.requireLower = o1.requireLower && o2.requireLower;
    o1.requireUpper = o1.requireUpper && o2.requireUpper;
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
    return other instanceof TextType;
  }

  public isValid(value: any): boolean 
  {
    if (!isString(value))
    {
      return false;
    }

    const { min, max, requireLower, requireUpper, matches, forceLower, forceUpper } = this.options;

    if (isNumber(min) && value.length < min)
    {
      return false;
    }

    if (isNumber(max) && value.length > max)
    {
      return false;
    }

    if (requireLower && value !== value.toLowerCase() && !forceLower)
    {
      return false;
    }

    if (requireUpper && value !== value.toUpperCase() && !forceUpper)
    {
      return false;
    }

    if (matches && matches instanceof RegExp && !matches.test(value))
    {
      return false;
    }

    return true;
  }

  public normalize(value: any): any
  {
    if (isString(value))
    {
      if (this.options.forceLower)
      {
        value = value.toLowerCase();
      }

      if (this.options.forceUpper)
      {
        value = value.toUpperCase();
      }
    }

    return value;
  }

  public encode(): any 
  {
    return TextType.encode(this);
  }

}