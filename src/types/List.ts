
import { isNumber, isEmpty } from '../fns';
import { Type, TypeProvider, TypeClass } from '../Type';
import { Operations } from '../Operation';
import { NumberType } from './Number';
import { AnyType } from './Any';


const INDEX_ITEM = 1;
const INDEX_OPTIONS = 2;

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
    const item = types.getType(data[INDEX_ITEM]);
    const options = data[INDEX_OPTIONS] || {};

    return new ListType({ item, ...options });
  }

  public static encode(type: ListType): any 
  {
    const options: any = { ...type.options };
    const item = options.item;
    delete options.item;

    return isEmpty(options)
      ? [this.id, item.encode()]
      : [this.id, item.encode(), options];
  }

  public static forItem(itemOrClass: Type | TypeClass<any, any>)
  {
    const item = itemOrClass instanceof Type ? itemOrClass : itemOrClass.baseType;
    
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

    for (const val of value)
    {
      if (!item.isValid(val)) 
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