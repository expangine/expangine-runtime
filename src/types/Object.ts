
import { objectMap, isObject } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider, TypeMap } from '../Type';
import { Operations } from '../Operation';


const INDEX_PROPS = 1;

export interface ObjectOptions 
{
  props: Record<string, Type>;
}

export class ObjectType extends Type<ObjectOptions> 
{

  public static id = 'obj';

  public static operations = new Operations('obj:');

  public static baseType = ObjectType.from();

  public static decode(data: any[], types: TypeProvider): ObjectType 
  {
    const props = objectMap(data[INDEX_PROPS], value => types.getType(value));
    
    return ObjectType.from(props);
  }

  public static encode(type: ObjectType): any 
  {
    const props = objectMap(type.options.props, p => p.encode());

    return [this.id, props];
  }

  public static describePriority: number = 5;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    if (!isObject(data) || data === null)
    {
      return null;
    }

    return ObjectType.from(objectMap(data, d => describer.describe(d)));
  }

  public static from(types?: TypeMap): ObjectType
  {
    return new ObjectType({
      props: types ? Type.resolve(types) : {}
    });
  }

  public getId(): string
  {
    return ObjectType.id;
  }

  public getOperations()
  {
    return ObjectType.operations.map;
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

  public newInstance(): ObjectType
  {
    return new ObjectType({ props: {} });
  }

  public clone(): ObjectType
  {
    return new ObjectType({
      props: objectMap(this.options.props, p => p.clone()),
    });
  }

  public encode(): any 
  {
    return ObjectType.encode(this);
  }

  public create(): any
  {
    return Object.create(null);
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const { props } = this.options;
    const out: any = Object.create(null);

    for (const prop in props)
    {
      out[prop] = props[prop].random(rnd);
    }

    return out;
  }

  public fromJson(json: any): any
  {
    return objectMap(json, (value, key) => {
      const propType = this.options.props[key];

      return propType ? propType.fromJson(value) : value;
    });
  }

  public toJson(value: any): any
  {
    return objectMap(value, (subvalue, key) => {
      const propType = this.options.props[key];
      
      return propType ? propType.toJson(subvalue) : subvalue;
    });
  }

}