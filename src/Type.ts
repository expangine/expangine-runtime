
import { objectMap, isArray, isObject } from './fns';
import { Operation, Operations } from './Operation';
import { Expression } from './Expression';
import { ExpressionBuilder } from './ExpressionBuilder';
import { Definitions } from './Definitions';


export type TypeInput = TypeClass | Type;

export type TypeInputMap = Record<string, TypeInput>;

export type TypeMap = Record<string, Type>;

export type TypeResolved<T> = T extends (null | undefined)
  ? undefined
  : T extends TypeInput
    ? Type
    : T extends TypeInput[]
      ? Type[]
      : T extends TypeInputMap
        ? Record<keyof T, Type>
        : {
          [K in keyof T]: TypeResolved<T[K]>
        };

export interface TypeProvider 
{
  getType(data: any): Type;
  getExpression(data: any): Expression;
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
  operations: Operations;
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

  public static resolve<T>(types: T): TypeResolved<T>
  {
    let result: any;

    if (!types)
    {
    }
    else if (types instanceof Type)
    {
      result = types;
    }
    else if ((types as any).baseType instanceof Type)
    {
      result = (types as any).baseType.newInstance();
    }
    else if (isArray(types))
    {
      result = types.map(t => this.resolve(t));
    }
    else if (isObject(types))
    {
      result = objectMap(types as any, t => this.resolve(t));
    }

    return result as unknown as TypeResolved<T>;
  }

  public options: O;

  public constructor(options: O) 
  {
    this.options = options;
  }

  public abstract getOperations(): Record<string, Operation<any, any, any, any, any>>;

  public abstract getId(): string;

  public abstract merge(type: Type<O>, describer: TypeDescribeProvider): void;

  public abstract getSubType(expr: Expression, def: Definitions, context: Type): Type | null;

  public abstract getSubTypes(): [TypeMap, Type[]] | null;

  public abstract getExactType(value: any): Type<O>;

  public abstract getSimplifiedType(): Type;

  public abstract isCompatible(other: Type<O>): boolean;

  public abstract getCreateExpression(ex: ExpressionBuilder): Expression;

  public abstract getValidateExpression(ex: ExpressionBuilder): Expression;

  public abstract getCompareExpression(ex: ExpressionBuilder): Expression;

  public abstract isValid(value: any): boolean;

  public abstract normalize(value: any): any;

  public abstract newInstance(): Type<O>;

  public abstract clone(): Type<O>;

  public abstract encode(): any;

  public abstract create(): any;

  public abstract random(rnd: (a: number, b: number, whole: boolean) => number): any;

  public abstract fromJson(json: any): any;

  public abstract toJson(value: any): any;
  
}