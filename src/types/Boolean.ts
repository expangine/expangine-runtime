
import { isBoolean, isEmpty } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { NumberType } from './Number';


const INDEX_OPTIONS = 1;
const RANDOM_TRUE_PROBABILITY = 0.5;

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
    return new BooleanType(data[INDEX_OPTIONS] || {});
  }

  public static encode(type: BooleanType): any 
  {
    return isEmpty(type.options)
      ? this.id
      : [this.id, type.options];
  }

  public static describePriority: number = 4;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    return isBoolean(data) ? this.baseType : null;
  }

  public getId(): string
  {
    return BooleanType.id;
  }

  public merge(type: BooleanType, describer: TypeDescribeProvider): void
  {
    
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

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return rnd(0, 1, false) < RANDOM_TRUE_PROBABILITY;
  }

}
