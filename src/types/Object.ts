
import { mapObject, isObject } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';


const INDEX_PROPS = 1;

export interface ObjectOptions 
{
  props: Record<string, Type>;
}

export class ObjectType extends Type<ObjectOptions> 
{

  public static id = 'obj';

  public static operations = new Operations<ObjectType>('obj:');

  public static baseType = new ObjectType({ props: {} });

  public static decode(data: any[], types: TypeProvider): ObjectType 
  {
    const props = mapObject(data[INDEX_PROPS], value => types.getType(value));
    
    return new ObjectType({ props });
  }

  public static encode(type: ObjectType): any 
  {
    const props = mapObject(type.options.props, p => p.encode());

    return [this.id, props];
  }

  public static describePriority: number = 5;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    if (!isObject(data) || data === null)
    {
      return null;
    }

    const props: Record<string, Type> = Object.create(null);

    for (const prop in data)
    {
      props[prop] = describer.describe(data[prop]);
    }

    return new ObjectType({ props });
  }

  public merge(type: ObjectType, describer: TypeDescribeProvider): void
  {
    const p1 = this.options.props;
    const p2 = type.options.props;

    for (const prop in p1)
    {
      if (prop in p2)
      {
        p1[prop] = describer.mergeType(p1[prop], p2[prop]);
      }
      else
      {
        p1[prop] = describer.optionalType(p1[prop]);
      }
    }

    for (const prop in p2)
    {
      if (!(prop in p1))
      {
        p1[prop] = describer.optionalType(p2[prop]);
      }
    }
  }

  public getSubTypes() 
  {
    return this.options.props;
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    if (!(other instanceof ObjectType)) 
    {
      return false;
    }

    const props = this.options.props;

    for (const prop in props) 
    {
      if (!other.options.props[prop]) 
      {
        return false;
      }
    }

    return true;
  }

  public isValid(value: any): boolean 
  {
    if (!isObject(value)) 
    {
      return false;
    }

    const props = this.options.props;

    for (const prop in props) 
    {
      if (!props[prop].isValid(value[prop])) 
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
    return ObjectType.encode(this);
  }

}