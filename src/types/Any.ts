
import { Type, TypeProvider } from '../Type';
import { Operations } from '../Operation';


export class AnyType extends Type 
{

  public static id = 'any';

  public static operations = new Operations<AnyType>('any:');

  public static baseType = new AnyType({});

  public static decode(data: any[], types: TypeProvider): AnyType 
  {
    return this.baseType;
  }

  public static encode(type: AnyType): any 
  {
    return this.id
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
    return true;
  }

  public isValid(value: any): boolean 
  {
    return true;
  }

  public normalize(value: any): any
  {
    return value;
  }

  public encode(): any 
  {
    return AnyType.encode(this);
  }

}
