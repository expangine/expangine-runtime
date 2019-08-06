
import { isNumber, isEmpty } from '../fns';
import { Type, TypeProvider } from '../Type';
import { Operations } from '../Operation';
import { NumberType } from './Number';
import { AnyType } from './Any';


export interface ListOptions 
{
  item: Type;
  min?: number;
  max?: number;
}

export class ListType extends Type<ListOptions> 
{

  public static lengthType = new NumberType({min: 0, whole: true});

  public static id = 'list';

  public static operations = new Operations<ListType>('list:');

  public static baseType = new ListType({ item: AnyType.baseType });

  public static decode(data: any[], types: TypeProvider): ListType 
  {
    const item = types.getType(data[1]);
    const options = data[2] || {};

    return new ListType({ item, ...options });
  }

  public static encode(type: ListType): any 
  {
    let options: any = { ...type.options };
    const item = options.item;
    delete options.item;

    return isEmpty(options)
      ? [this.id, item.encode()]
      : [this.id, item.encode(), options];
  }

  public static forItem(item: Type)
  {
    return new ListType({ item });
  }

  public getSubTypes() 
  {
    return {
      length: ListType.lengthType,
      item: this.options.item
    };
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    return other instanceof ListType && this.options.item.isCompatible(other.options.item);
  }

  public isValid(value: any): boolean 
  {
    if (!Array.isArray(value)) 
    {
      return false;
    }

    const { item, min, max } = this.options;

    if (isNumber(min) && value.length < min) 
    {
      return false;
    }

    if (isNumber(max) && value.length > max) 
    {
      return false;
    }

    for (let i = 0; i < value.length; i++) 
    {
      if (!item.isValid(value[i])) 
      {
        return false;
      }
    }

    return true;
  }

  public normalize(value: any): any
  {
    return value;
  }

  public encode(): any 
  {
    return ListType.encode(this);
  }

}