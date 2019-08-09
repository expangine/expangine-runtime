
import { isFunction } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { ObjectType } from './Object';
import { AnyType } from './Any';


const INDEX_RETURN = 1;
const INDEX_PARAMS = 2;

export interface FunctionOptions 
{
  returnType: Type;
  params: ObjectType;
}

export class FunctionType extends Type<FunctionOptions> 
{

  public static id = 'func';

  public static operations = new Operations<FunctionType>('func:');

  public static baseType = new FunctionType({ returnType: AnyType.baseType, params: ObjectType.baseType });

  public static decode(data: any[], types: TypeProvider): FunctionType 
  {
    const returnType = types.getType(data[INDEX_RETURN]);
    const params = types.getType([ObjectType.id, data[INDEX_PARAMS]]) as ObjectType;

    return new FunctionType({ returnType, params });
  }

  public static encode(type: FunctionType): any 
  {
    let options: any = type.options;
    if (!options.true && !options.false) {
      options = undefined;
    }

    return options ? [this.id, options] : this.id;
  }

  public static describePriority: number = -1;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    return null;
  }

  public merge(type: FunctionType, describer: TypeDescribeProvider): void
  {
    
  }

  public getSubTypes() 
  {
    const { returnType, params } = this.options;

    return { returnType, params };
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    return other instanceof FunctionType;
  }

  public isValid(value: any): boolean 
  {
    return isFunction(value);
  }

  public normalize(value: any): any
  {
    return value;
  }

  public encode(): any 
  {
    return FunctionType.encode(this);
  }

}