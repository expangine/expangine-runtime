
import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions, TypeChild } from '../Type';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { ID } from './ID';
import { Traverser, TraverseStep } from '../Traverser';
import { NullType } from './Null';
import { Operations } from '../Operation';
import { Computeds } from '../Computed';


const INDEX_NAME = 1;

export class ReferenceType extends Type<any, string>
{

  public static STEP_REFERENCED = 'referenced';

  public static CHILD_REFERENCED = 'referenced';

  public static id = ID.Reference;

  public static operations = new Operations(ID.Reference + ID.Delimiter);

  public static computeds = new Computeds(ID.Reference + ID.Delimiter);

  public static baseType = new ReferenceType('', null);

  public static decode(data: any[], types: TypeProvider): ReferenceType 
  {
    const type = data[INDEX_NAME];

    return new ReferenceType( type, types );
  }

  public static encode(type: ReferenceType): any 
  {
    return [this.id, type.options];
  }

  public static describePriority: number = -1;
  
  public static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | null
  {
    return null;
  }

  public static registered: boolean = false;

  public static register(): void
  {

  }

  protected provider: TypeProvider;

  public constructor(name: string, provider: TypeProvider)
  {
    super(name);

    this.provider = provider;
  }

  public getType()
  {
    if (!this.provider)
    {
      return NullType.baseType;
    }

    const data = this.provider.getData(this.options);

    return data ? data.dataType : NullType.baseType;
  }

  public getOperations()
  {
    return this.getType().getOperations();
  }

  public getId(): string
  {
    return ReferenceType.id;
  }

  public merge(type: ReferenceType): void
  {
    
  }

  public getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null
  {
    return this.getType().getSubType(expr, def, context);
  }

  public getSubTypes(def: DefinitionProvider): TypeSub[]
  {
    return this.getType().getSubTypes(def);
  }

  public getChildType(name: TypeChild): Type | null
  {
    return name === ReferenceType.CHILD_REFERENCED
      ? this.getType()
      : null;
  }

  public getChildTypes(): TypeChild[]
  {
    return [ReferenceType.CHILD_REFERENCED];
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
    return other instanceof ReferenceType
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
    return traverse.enter(this, () => 
      traverse.step(ReferenceType.STEP_REFERENCED, this.getType(), (replaceWith) => replaceWith instanceof ReferenceType ? this.options = replaceWith.options : 0)
    );
  }

  public getTypeFromStep(step: TraverseStep): Type | null
  {
    return step === ReferenceType.STEP_REFERENCED
      ? this.getType() 
      : null;
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

  public getValueChangeExpression(newValue: Expression, from?: TraverseStep, to?: TraverseStep): Expression
  {
    // from & to === referenced
    return newValue;
  }
  
  public isValid(value: any): value is any 
  {
    return this.getType().isValid(value);
  }

  public normalize(value: any): any
  {
    return this.getType().normalize(value);
  }

  public newInstance(): ReferenceType
  {
    return new ReferenceType(this.options, this.provider);
  }

  public clone(): ReferenceType
  {
    return new ReferenceType(this.options, this.provider);
  }

  public encode(): any 
  {
    return ReferenceType.encode(this);
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