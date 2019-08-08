
import { mapObject, isObject } from '../fns';
import { Type, TypeProvider } from '../Type';
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