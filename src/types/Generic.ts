
import { Type, TypeProvider, TypeClass } from '../Type';
import { Operations, Operation } from '../Operation';


const INDEX_NAME = 1;

export class GenericType extends Type<string>
{

  public static id = '<>';

  public static operations = new Operations<GenericType>('<>:');

  public static baseType = new GenericType('T');

  public static decode(data: any[], types: TypeProvider): GenericType 
  {
    return new GenericType(data[INDEX_NAME] || 'T');
  }

  public static encode(type: GenericType): any 
  {
    return [this.id, type.options];
  }

  public inferredType?: Type;

  public getOperations(type: TypeClass<any, any>): Record<string, Operation> 
  {
    if (!this.operations && this.inferredType)
    {
      this.operations = this.inferredType.getOperations(type);
    }

    return this.operations;
  }

  public getSubTypes() 
  {
    return this.inferredType ? this.inferredType.getSubTypes() : null;
  }

  public getExactType(value: any): Type 
  {
    return this.inferredType ? this.inferredType.getExactType(value) : this;
  }

  public isCompatible(other: Type): boolean 
  {
    return this.inferredType ? this.inferredType.isCompatible(other) : true;
  }

  public isValid(value: any): boolean 
  {
    return this.inferredType ? this.inferredType.isValid(value) : true;
  }

  public normalize(value: any): any
  {
    return this.inferredType ? this.inferredType.normalize(value) : value;
  }

  public encode(): any 
  {
    return GenericType.encode(this);
  }

}
