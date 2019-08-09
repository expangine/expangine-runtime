
import { isObject } from '../fns';
import { Type, TypeProvider, TypeInput } from '../Type';
import { Operations } from '../Operation';
import { AnyType } from './Any';
import { TextType } from './Text';
import { ListType } from './List';
import { ObjectType } from './Object';


const INDEX_VALUE = 1;
const INDEX_KEY = 2;

export interface MapOptions 
{
  key: Type;
  value: Type;
}

export class MapType extends Type<MapOptions> 
{

  public static id = 'map';

  public static operations = new Operations<MapType>('map:');

  public static baseType = new MapType({ key: TextType.baseType, value: AnyType.baseType });

  public static decode(data: any[], types: TypeProvider): MapType 
  {
    const value = types.getType(data[INDEX_VALUE]);
    const key = data[INDEX_KEY] ? types.getType(data[INDEX_KEY]) : TextType.baseType;

    return new MapType({ key, value });
  }

  public static encode(type: MapType): any 
  {
    const { key, value } = type.options;

    return key !== TextType.baseType
      ? [this.id, value.encode()]
      : [this.id, value.encode(), key.encode()];
  }

  public static forItem(valueOrClass: TypeInput, keyOrClass: TypeInput = TextType)
  {
    const value = Type.fromInput(valueOrClass);
    const key = Type.fromInput(keyOrClass);
    
    return new MapType({ key, value });
  }

  public getSubTypes() 
  {
    const { key, value } = this.options;

    return { key, value };
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    return other instanceof MapType && 
      this.options.key.isCompatible(other.options.key) && 
      this.options.value.isCompatible(other.options.value);
  }

  public isValid(test: any): boolean 
  {
    if (test instanceof Map && isObject(test))
    {
      const { key, value } = this.options;

      return this.iterate(test, true, (k, v) => {
        if (!key.isValid(k) || !value.isValid(v)) {
          return false;
        }
      });
    }

    return false;
  }

  public normalize(test: any): any
  {
    const { key, value } = this.options;
    const entries: [any, any][] = [];

    this.iterate(test, undefined, (k, v) => {
      entries.push([
        key.normalize(k),
        value.normalize(v)
      ]);
    });

    return new Map(entries);
  }

  private iterate<R>(map: any, otherwise: R, onItem: (key: any, value: any) => R): R
  {
    if (map instanceof Map)
    {
      for (const [key, value] of map.entries())
      {
        const result = onItem(key, value);

        if (result !== undefined)
        {
          return result;
        }
      }
    }
    else if (isObject(map))
    {
      for (const prop of map)
      {
        const result = onItem(prop, map[prop]);

        if (result !== undefined)
        {
          return result;
        }
      }
    }
    
    return otherwise;
  }

  public encode(): any 
  {
    return MapType.encode(this);
  }

  public getValuesType()
  {
    return ListType.forItem(this.options.value);
  }

  public getKeysType()
  {
    return ListType.forItem(this.options.key);
  }

  public getEntriesType()
  {
    return new ObjectType({ 
      props: {
        keys: this.getKeysType(),
        values: this.getValuesType()
      }
    });
  }

  public getIterationScope()
  {
    return { 
      map: this as MapType,
      key: this.options.key,
      value: this.options.value
    };
  }

  public static readonly IterationScopeDefaults = { 
    map: 'map',
    key: 'key',
    value: 'value'
  };

  public getCompareScope()
  {
    return { 
      key: this.options.key, 
      value: this.options.value, 
      test: this.options.value 
    };
  }

  public static readonly CompareScopeDefaults = { 
    key: 'key', 
    value: 'value', 
    test: 'test'
  };

}