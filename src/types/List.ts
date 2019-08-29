
import { isNumber, isEmpty, isArray, coalesce } from '../fns';
import { Type, TypeProvider, TypeInput, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { NumberType } from './Number';
import { AnyType } from './Any';
import { ObjectType } from './Object';


const INDEX_ITEM = 1;
const INDEX_OPTIONS = 2;
const RANDOM_MIN = 2;
const RANDOM_MAX = 5;

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

  public static describePriority: number = 6;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    if (!isArray(data))
    {
      return null;
    }

    let item = describer.describe(data[0]);

    for (let i = 1; i < data.length; i++)
    {
      item = describer.merge(item, data[i]);
    }

    return new ListType({ 
      item,
      min: data.length,
      max: data.length
    });
  }

  public static forItem(itemOrClass: TypeInput)
  {
    const item = Type.fromInput(itemOrClass);
    
    return new ListType({ item });
  }

  public getId(): string
  {
    return ListType.id;
  }

  public merge(type: ListType, describer: TypeDescribeProvider): void
  {
    const o1 = this.options;
    const o2 = type.options;

    o1.item = describer.mergeType(o1.item, o2.item);
    o1.min = Math.min(o1.min, o2.min);
    o1.max = Math.max(o1.max, o2.max);
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
    if (isArray(value))
    {
      const item = this.options.item; 

      for (let i = 0; i < value.length; i++)
      {
        value[i] = item.normalize(value[i]);
      }
    }
    
    return value;
  }

  public encode(): any 
  {
    return ListType.encode(this);
  }

  public create(): any[]
  {
    return [];
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const { min, max } = this.options;
    const chosenMin = coalesce(min, RANDOM_MIN);
    const chosenMax = coalesce(max, RANDOM_MAX);
    const start = Math.min(chosenMin, chosenMax);
    const end = Math.max(chosenMin, chosenMax);
    const n = rnd(start, end + 1, true);
    const out: any[] = [];

    for (let i = 0; i < n; i++)
    {
      out.push(this.options.item.random(rnd));
    }

    return out;
  }

  public fromJson(json: any[]): any[]
  {
    return json.map((e: any) => this.options.item.fromJson(e));
  }

  public toJson(value: any[]): any[]
  {
    return value.map((e: any) => this.options.item.toJson(e));
  }

  public getSplitResultType()
  {
    return ObjectType.from({ pass: this, fail: this });
  }

  public getIterationScope()
  {
    return { 
      list: this as ListType,
      item: this.options.item,
      index: ListType.lengthType
    };
  }

  public static readonly IterationScopeDefaults = {
    list: 'list',
    item: 'item',
    index: 'index'
  };

  public getCompareScope()
  {
    return {
      list: this as ListType,
      value: this.options.item,
      test: this.options.item
    };
  }

  public static readonly CompareScopeDefaults = {
    list: 'list',
    value: 'value',
    test: 'test'
  };

}