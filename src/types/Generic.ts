
import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions, TypeChild } from '../Type';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { ID } from './ID';
import { Traverser } from '../Traverser';
import { Operations } from '../Operation';
import { Computeds } from '../Computed';
import { FunctionType } from './Function';
import { AnyType } from './Any';


const INDEX_PATH = 1;
const INDEX_DEFAULT = 2;

export interface GenericOptions 
{
  path: TypeChild[];
  base?: Type;
}

export class GenericType extends Type<any, GenericOptions>
{

  public static id = ID.Generic;

  public static operations = new Operations(ID.Generic + ID.Delimiter);

  public static computeds = new Computeds(ID.Generic + ID.Delimiter);

  public static baseType = new GenericType({ path: [] });

  public static decode(data: any[], types: TypeProvider): GenericType 
  {
    const path = data[INDEX_PATH];
    const base = data[INDEX_DEFAULT]
      ? types.getType(data[INDEX_DEFAULT])
      : undefined;

    return new GenericType({ path, base });
  }

  public static encode(type: GenericType): any 
  {
    const path = type.options.path.slice();

    return type.options.base
      ? [this.id, path, type.options.base.encode()]
      : [this.id, path];
  }

  public static describePriority: number = 8;
  
  public static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | undefined
  {
    return undefined;
  }

  public static registered: boolean = false;

  public static register(): void
  {

  }

  public getFunction(): FunctionType | undefined
  {
    let parent = this.parent;

    while (parent) 
    {
      if (parent instanceof FunctionType) 
      {
        return parent;
      }

      parent = parent.parent;
    }

    return undefined;
  }

  public getResolvedType(): Type
  {
    const { path, base } = this.options;
    
    return this.getFunction()?.getTypeFromPath(path) || base || AnyType.baseType;
  }

  public getId(): string
  {
    return GenericType.id;
  }

  public getOperations()
  {
    return this.getResolvedType().getOperations();
  }

  public merge(type: GenericType): void
  {
    
  }

  public getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | undefined
  {
    return this.getResolvedType().getSubType(expr, def, context);
  }

  public getSubTypes(def: DefinitionProvider): TypeSub[]
  {
    return this.getResolvedType().getSubTypes(def);
  }

  public getChildType(name: TypeChild): Type | undefined
  {
    return this.getResolvedType().getChildType(name);
  }

  public getChildTypes(): TypeChild[]
  {
    return this.getResolvedType().getChildTypes();
  }

  public getExactType(value: any): Type 
  {
    return this.getResolvedType().getExactType(value);
  }

  public getSimplifiedType(): Type
  {
    return this;
  }

  public isWrapper(): boolean
  {
    return true;
  }

  public getWrappedType(): Type
  {
    return this.getResolvedType();
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
    return this.getResolvedType().isOptional();
  }

  public isSimple(): boolean
  {
    return this.getResolvedType().isOptional();
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this);
  }

  public setParent(parent?: Type): void
  {
    this.parent = parent;
  }

  public removeDescribedRestrictions(): void
  {

  }

  public getCreateExpression(): Expression
  {
    return this.getResolvedType().getCreateExpression();
  }

  public getValidateExpression(): Expression
  {
    return this.getResolvedType().getValidateExpression();
  }

  public getCompareExpression(): Expression
  {
    return this.getResolvedType().getCompareExpression();
  }

  public isValid(value: any): value is any 
  {
    return this.getResolvedType().isValid(value);
  }

  public normalize(value: any): any
  {
    return this.getResolvedType().normalize(value);
  }

  public newInstance(): GenericType
  {
    return new GenericType({ path: [] });
  }

  public clone(): GenericType
  {
    const path = this.options.path.slice();
    const base = this.options.base?.clone();

    return new GenericType({ path, base });
  }

  public encode(): any 
  {
    return GenericType.encode(this);
  }

  public create(): any
  {
    return this.getResolvedType().create();
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return this.getResolvedType().random(rnd);
  }

  public fromJson(json: any): any
  {
    return this.getResolvedType().fromJson(json);
  }

  public toJson(value: any): any
  {
    return this.getResolvedType().toJson(value);
  }

}
