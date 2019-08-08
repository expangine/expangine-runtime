
import { Type, TypeProvider, TypeClass } from '../Type';
import { Operations, Operation } from '../Operation';
import { AnyType } from './Any';


const INDEX_TYPE = 1;

export class OptionalType extends Type<Type>
{

  public static id = '?';

  public static operations = new Operations<OptionalType>('?:');

  public static baseType = new OptionalType(AnyType.baseType);

  public static decode(data: any[], types: TypeProvider): OptionalType 
  {
    const type = types.getType(data[INDEX_TYPE]);

    return new OptionalType( type );
  }

  public static encode(type: OptionalType): any 
  {
    return [this.id, type.options.encode()];
  }

  public getOperations(type: TypeClass<any, any>): Record<string, Operation> 
  {
    if (!this.operations)
    {
      this.operations = this.options.getOperations(type);
    }

    return this.operations;
  }

  public getSubTypes() 
  {
    return this.options.getSubTypes();
  }

  public getExactType(value: any): Type 
  {
    return this.options.getExactType(value);
  }

  public isCompatible(other: Type): boolean 
  {
    return other instanceof OptionalType
      ? this.options.isCompatible(other.options)
      : this.options.isCompatible(other);
  }

  public isValid(value: any): boolean 
  {
    return value === null 
      || value === undefined
      || this.options.isCompatible(value);
  }

  public normalize(value: any): any
  {
    return value === null || value === undefined
      ? value
      : this.options.normalize(value);
  }

  public encode(): any 
  {
    return OptionalType.encode(this);
  }

}
