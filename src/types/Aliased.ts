
import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
import { ID } from './ID';
import { Traverser } from '../Traverser';
import { Computeds } from '../Computed';
import { NullType } from './Null';


const INDEX_NAME = 1;

export class AliasedType extends Type<string>
{

  public static id = ID.Aliased;

  public static operations = new Operations(ID.Aliased + ID.Delimiter);

  public static computeds = new Computeds(ID.Aliased + ID.Delimiter);

  public static baseType = new AliasedType('', null);

  public static decode(data: any[], types: TypeProvider): AliasedType 
  {
    const type = data[INDEX_NAME];

    return new AliasedType( type, types );
  }

  public static encode(type: AliasedType): any 
  {
    return [this.id, type.options];
  }

  public static describePriority: number = -1;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    return null;
  }

  public static registered: boolean = false;

  public static register(): void
  {

  }

  public static for(name: string, provider: TypeProvider): AliasedType
  {
    return new AliasedType(name, provider);
  }

  protected provider: TypeProvider;

  public constructor(name: string, provider: TypeProvider)
  {
    super(name);

    this.provider = provider;
  }

  public getType()
  {
    return this.provider.getType(this.options) || NullType.baseType;
  }

  public getOperations()
  {
    return this.getType().getOperations();
  }

  public getId(): string
  {
    return AliasedType.id;
  }

  public merge(type: AliasedType, describer: TypeDescribeProvider): void
  {
    
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    return this.getType().getSubType(expr, def, context);
  }

  public getSubTypes(def: Definitions): TypeSub[]
  {
    return this.getType().getSubTypes(def);
  }

  public getExactType(value: any): Type 
  {
    return this.getType().getExactType(value);
  }

  public getSimplifiedType(): Type
  {
    return this.getType().getSimplifiedType();
  }

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean 
  {
    return other instanceof AliasedType
      ? this.getType().isCompatible(other.getType(), options)
      : this.getType().isCompatible(other, options);
  }

  public isOptional(): boolean
  {
    return this.getType().isOptional();
  }

  public isSimple(): boolean
  {
    return this.getType().isSimple();
  }

  protected acceptsOtherTypes(): boolean
  {
    return true;
  }
  
  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this, () => traverse.step('aliased', this.getType()));
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
    return this.getType().getCreateExpression();
  }

  public getValidateExpression(): Expression
  {
    return this.getType().getValidateExpression();
  }

  public getCompareExpression(): Expression
  {
    return this.getType().getCompareExpression();
  }

  public isValid(value: any): boolean 
  {
    return this.getType().isValid(value);
  }

  public normalize(value: any): any
  {
    return this.getType().normalize(value);
  }

  public newInstance(): AliasedType
  {
    return new AliasedType(this.options, this.provider);
  }

  public clone(): AliasedType
  {
    return new AliasedType(this.options, this.provider);
  }

  public encode(): any 
  {
    return AliasedType.encode(this);
  }

  public create(): any
  {
    return this.getType().create();
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return this.getType().random(rnd);
  }

  public fromJson(json: any): any
  {
    return this.getType().fromJson(json);
  }

  public toJson(value: any): any
  {
    return this.getType().toJson(value);
  }

}