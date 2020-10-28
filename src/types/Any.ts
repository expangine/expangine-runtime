
import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { isObject, isString } from '../fns';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { AnyOps, AnyOperations, AnyComputeds } from '../ops/AnyOps';
import { ID } from './ID';
import { Traverser } from '../Traverser';
import { Exprs } from '../Exprs';
import { DataTypes } from '../DataTypes';


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
  
  public static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | null
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

  public getId(): string
  {
    return AnyType.id;
  }

  public getOperations()
  {
    return AnyType.operations.map;
  }

  public merge(type: AnyType): void
  {
    
  }

  public getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null
  {
    return null;
  }

  public getSubTypes(def: DefinitionProvider): TypeSub[]
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

  public getCreateExpression(): Expression
  {
    return Exprs.string();
  }

  public getValidateExpression(): Expression
  {
    return Exprs.true();
  }

  public getCompareExpression(): Expression
  {
    return Exprs.op(AnyOps.cmp, {
      value: Exprs.get('value'),
      test: Exprs.get('test'),
    });
  }

  public isValid(value: any): value is any 
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

  public fromJson(json: any): any
  {
    return DataTypes.fromJson(json);
  }

  public toJson(value: any): any
  {
    return DataTypes.toJson(value);
  }

}
