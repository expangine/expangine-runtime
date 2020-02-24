
import { Type, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { AnyOps } from '../ops/AnyOps';
import { Exprs } from '../Exprs';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { ID } from './ID';
import { Traverser } from '../Traverser';
import { Computeds } from '../Computed';


export class NullType extends Type<null> 
{

  public static id = ID.Null;

  public static operations = new Operations(ID.Null + ID.Delimiter);

  public static computeds = new Computeds(ID.Null + ID.Delimiter);

  public static baseType = new NullType(null);

  public static decode(data: any[]): NullType 
  {
    return NullType.baseType;
  }

  public static encode(type: NullType): any 
  {
    return this.id;
  }

  public static describePriority: number = 6;
  
  public static describe(data: any): Type | null
  {
    return data === null || data === undefined ? this.baseType : null;
  }

  public static registered: boolean = false;

  public static register(): void
  {

  }

  public getId(): string
  {
    return NullType.id;
  }

  public getOperations()
  {
    return NullType.operations.map;
  }

  public merge(type: NullType): void
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

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean 
  {
    return other instanceof NullType;
  }

  public isOptional(): boolean
  {
    return true;
  }

  public isSimple(): boolean
  {
    return true;
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this);
  }

  public setParent(parent: Type = null): void
  {
    
  }

  public removeDescribedRestrictions(): void
  {
    
  }

  public getCreateExpression(): Expression
  {
    return Exprs.null();
  }

  public getValidateExpression(): Expression
  {
    return Exprs.op(AnyOps.isEqual, {
      value: Exprs.get('value'),
      test: Exprs.null(),
    });
  }

  public getCompareExpression(): Expression
  {
    return Exprs.op(AnyOps.cmp, {
      value: Exprs.get('value'),
      test: Exprs.get('test'),
    });
  }

  public isValid(value: any): boolean 
  {
    return value === null || value === undefined;
  }

  public normalize(value: any): any
  {
    return value;
  }

  public newInstance(): NullType
  {
    return this;
  }

  public clone(): NullType
  {
    return this;
  }

  public encode(): any 
  {
    return NullType.encode(this);
  }

  public create(): null
  {
    return null;
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return null;
  }

  public fromJson(json: null): null
  {
    return null;
  }

  public toJson(value: null): null
  {
    return null;
  }

}
