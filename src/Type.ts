
import { mapObject } from './fns';
import { Operation, Operations } from './Operation';


export type TypeInput = TypeClass | Type;

export type TypeMap = Record<string, TypeInput>;

export interface TypeProvider 
{
  getType(data: any): Type;
}

export interface TypeDescribeProvider
{
  describe(data: any): Type;
  merge(type: Type, data: any): Type;
  mergeType(type: Type, other: Type): Type;
  optionalType(type: Type): Type;
}

export interface TypeParser 
{
  (data: any, types: TypeProvider): Type;
}

export interface TypeClass<T extends Type<O> = any, O = any> 
{
  id: string;
  operations: Operations<T>;
  baseType: T;
  decode(this: TypeClass<T>, data: any[], types: TypeProvider): T;
  encode(this: TypeClass<T>, type: T): any;
  describePriority: number;
  describe(this: TypeClass<T>, data: any, describer: TypeDescribeProvider): Type | null;
  new(options: O): T;
}

export abstract class Type<O = any> 
{

  public static fromInput(input: TypeInput): Type
  {
    return input instanceof Type
      ? input
      : input.baseType;
  }

  public options: O;
  public operations?: Record<string, Operation>;

  public constructor(options: O) 
  {
    this.options = options;
  }

  public getOperations(type: TypeClass<any, O>): Record<string, Operation> 
  {
    if (!this.operations) 
    {
      this.operations = mapObject(type.operations.map, builder => builder(this));
    }

    return this.operations;
  }

  public abstract merge(type: Type<O>, describer: TypeDescribeProvider): void;

  public abstract getSubTypes(): Record<string, Type> | null;

  public abstract getExactType(value: any): Type<O>;

  public abstract isCompatible(other: Type<O>): boolean;

  public abstract isValid(value: any): boolean;

  public abstract normalize(value: any): any;

  public abstract encode(): any;
  
}