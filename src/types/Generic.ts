
import { Type, TypeProvider, TypeClass, TypeDescribeProvider } from '../Type';
import { Operations, Operation } from '../Operation';


const INDEX_NAME = 1;

export class GenericType extends Type<string>
{

  public static id = '<>';

  public static operations = new Operations<GenericType>('<>:');

  public static baseType = new GenericType('T');

  public static decode(data: any[], types: TypeProvider): GenericType 
  {
    const name = data[INDEX_NAME] || 'T';

    return new GenericType(name);
  }

  public static encode(type: GenericType): any 
  {
    return [this.id, type.options];
  }

  public static describePriority: number = -1;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    return null;
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

  public getId(): string
  {
    return GenericType.id;
  }

  public merge(type: GenericType, describer: TypeDescribeProvider): void
  {
    
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

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return this.inferredType ? this.inferredType.random(rnd) : undefined;
  }

  public fromJson(json: any): any
  {
    return json;
  }

  public toJson(value: any): any
  {
    return value;
  }

}
