
import { isNumber, isEmpty } from '../fns';
import { Type } from '../Type';
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