
import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { AnyType } from './Any';


const INDEX_TYPE = 1;
const RANDOM_CHANCE = 0.3;

export class OptionalType extends Type<Type>
{

  public static id = '?';

  public static operations = new Operations('?:');

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

  public static describePriority: number = -1;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    return null;
  }

  public getOperations()
  {
    return this.options.getOperations();
  }

  public getId(): string
  {
    return OptionalType.id;
  }

  public merge(type: OptionalType, describer: TypeDescribeProvider): void
  {
    
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

  public newInstance(): OptionalType
  {
    return new OptionalType(this.options.newInstance());
  }

  public clone(): OptionalType
  {
    return new OptionalType(this.options.clone());
  }

  public encode(): any 
  {
    return OptionalType.encode(this);
  }

  public create(): any
  {
    return this.options ? this.options.create() : undefined;
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return this.options && rnd(0, 1, false) > RANDOM_CHANCE
      ? this.options.random(rnd)
      : undefined;
  }

  public fromJson(json: any): any
  {
    return json === undefined ? undefined : this.options.fromJson(json);
  }

  public toJson(value: any): any
  {
    return value === undefined ? undefined : this.options.toJson(value);
  }

}
