
import { isString, isNumber, isEmpty } from '../fns';
import { Type } from '../Type';
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

    const { min, max, requireLower, requireUpper, matches } = this.options;

    if (isNumber(min) && value.length < min)
    {
      return false;
    }

    if (isNumber(max) && value.length > max)
    {
      return false;
    }

    if (requireLower && value !== value.toLowerCase())
    {
      return false;
    }

    if (requireUpper && value !== value.toUpperCase())
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