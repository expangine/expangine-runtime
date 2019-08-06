
import { isBoolean, isEmpty } from '../fns';
import { Type, TypeProvider } from '../Type';
import { Operations } from '../Operation';
import { NumberType } from './Number';


export interface BooleanOptions 
{
  true?: Record<string, true>;
  false?: Record<string, false>;
}

export class BooleanType extends Type<BooleanOptions> 
{

  public static id = 'bool';

  public static operations = new Operations<BooleanType>('bool:');

  public static baseType = new BooleanType({});

  public static decode(data: any[], types: TypeProvider): BooleanType 
  {
    return new BooleanType(data[1] || {});
  }

  public static encode(type: BooleanType): any 
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
    return other instanceof BooleanType || other instanceof NumberType;
  }

  public isValid(value: any): boolean 
  {
    if (isBoolean(value))
    {
      return true;
    }

    const asKey = value + '';

    if (this.options.true && this.options.true[asKey])
    {
      return true;
    }
    
    if (this.options.false && this.options.false[asKey])
    {
      return true;
    }

    return false;
  }

  public normalize(value: any): any
  {
    if (!isBoolean(value))
    {
      const asKey = value + '';

      if (this.options.true && this.options.true[asKey])
      {
        return true;
      }
      
      if (this.options.false && this.options.false[asKey])
      {
        return false;
      }
    }

    return value;
  }

  public encode(): any 
  {
    return BooleanType.encode(this);
  }

}
