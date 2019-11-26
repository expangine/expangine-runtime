
import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { isObject, isString } from '../fns';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
import { AnyOps, AnyOperations, AnyComputeds } from '../ops/AnyOps';
import { ID } from './ID';
import { Traverser } from '../Traverser';


export type AnyTypeJsonReader = (value: any, reader: (innerValue: any) => any) => any;

export type AnyTypeJsonWriter = (value: any, writer: (innerValue: any) => any) => any;


export class AnyType extends Type 
{

  public static id = ID.Any;

  public static operations = AnyOperations;

  public static computeds = AnyComputeds;

  public static baseType = new AnyType({});

  public static decode(data: any[], types: TypeProvider): AnyType 
  {
    return this.baseType;
  }

  public static encode(type: AnyType): any 
  {
    return this.id
  }

  public static describePriority: number = 8;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    if (isObject(data) && isString(data.$any))
    {
      return new AnyType({});
    }

    return null;
  }

  public static registered: boolean = false;

  public static register(): void
  {

  }

  public static jsonReaders: Array<{ priority: number, reader: AnyTypeJsonReader }> = [];

  public static jsonWriters: Array<{ priority: number, writer: AnyTypeJsonWriter }> = [];

  public static addJsonReader(priority: number, reader: AnyTypeJsonReader)
  {
    this.jsonReaders.push({ priority, reader });
    this.jsonReaders.sort((a, b) => b.priority - a.priority);
  }

  public static addJsonWriter(priority: number, writer: AnyTypeJsonWriter)
  {
    this.jsonWriters.push({ priority, writer });
    this.jsonWriters.sort((a, b) => b.priority - a.priority);
  }


  public getId(): string
  {
    return AnyType.id;
  }

  public getOperations()
  {
    return AnyType.operations.map;
  }

  public merge(type: AnyType, describer: TypeDescribeProvider): void
  {
    
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    return null;
  }

  public getSubTypes(def: Definitions): TypeSub[]
  {
    return [];
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public getSimplifiedType(): Type
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    return true;
  }

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions)
  {
    return true;
  }

  public isOptional(): boolean
  {
    return true;
  }

  public isSimple(): boolean
  {
    return false;
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this);
  }

  public setParent(parent: Type = null): void
  {
    this.parent = parent;
  }

  public removeDescribedRestrictions(): void
  {

  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.string();
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.true();
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(AnyOps.cmp, {
      value: ex.get('value'),
      test: ex.get('test'),
    });
  }

  public isValid(value: any): boolean 
  {
    return true;
  }

  public normalize(value: any): any
  {
    return value;
  }

  public newInstance(): AnyType
  {
    return new AnyType({});
  }

  public clone(): AnyType
  {
    return new AnyType({});
  }

  public encode(): any 
  {
    return AnyType.encode(this);
  }

  public create(): any
  {
    return '';
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return null;
  }

  public fromJson(json: any | { $any: string, value: any }): any
  {
    const reader = (value: any) => this.fromJson(value);

    for (const jsonReader of AnyType.jsonReaders)
    {
      const read = jsonReader.reader(json, reader);

      if (read !== undefined)
      {
        return read;
      }
    }

    return json;
  }

  public toJson(value: any): any | { $any: string, value: any }
  {
    const writer = (json: any) => this.toJson(json);

    for (const jsonWriter of AnyType.jsonWriters)
    {
      const written = jsonWriter.writer(value, writer);

      if (written !== undefined)
      {
        return written;
      }
    }

    return value;
  }

}
