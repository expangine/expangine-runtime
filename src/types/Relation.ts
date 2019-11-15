
import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeInput, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { AnyType } from './Any';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
import { ID } from './ID';
import { Traverser } from '../Traverser';
import { isString } from '../fns';
import { ListType } from './List';
import { OptionalType } from './Optional';


const INDEX_RELATED_TYPE = 1;
const INDEX_OPTIONS = 2;

export interface RelationOptions
{
  related?: string;             // the name of the related type
  relatedType: Type;            // the resolved related type
  relatedKey?: string[];        // props on related type
  localKey?: string[];          // props on this type
  multiple?: boolean;           // list or single? key is stored on related
  required?: boolean;           // remove this when related removed (if single)
  owns?: boolean;               // remove related when this removed
  morphKey?: string;            // prop where key is stored that determines type
  morph?: Record<any, string>;  // morph value to type alias
}

export class RelationType extends Type<RelationOptions>
{

  public static id = ID.Relation;

  public static operations = new Operations(ID.Relation + ':');

  public static baseType = new RelationType({ relatedType: AnyType.baseType });

  public static decode(data: any[], types: TypeProvider): RelationType 
  {
    const relatedType: Type = types.getType(data[INDEX_RELATED_TYPE]);
    const related: string = isString(data[INDEX_RELATED_TYPE]) ? data[INDEX_RELATED_TYPE]: '';
    const options: Partial<RelationOptions> = data[INDEX_OPTIONS] || {};

    return new RelationType({
      ...options,
      relatedType,
      related,
    });
  }

  public static encode(type: RelationType): any 
  {
    const options = { ...type.options };
    const related = options.related ? options.related : options.relatedType.encode();

    delete options.related;
    delete options.relatedType;

    return [this.id, related, options];
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

  public static for(relatedType: TypeInput, related?: string): RelationType
  {
    return new RelationType({ 
      related,
      relatedType: Type.fromInput(relatedType),
    });
  }

  public cachedType: Type | null = null;

  public getResolvedType(): Type
  {
    let resolved = this.cachedType;
    const { multiple, required, relatedType } = this.options;

    if (!resolved
      || (multiple !== resolved instanceof ListType)
      || (required !== !resolved.isOptional()))
    {
      this.cachedType = resolved = multiple
        ? ListType.forItem(relatedType)
        : required
          ? relatedType
          : OptionalType.for(relatedType);
      
      this.cachedType.setParent(this);
    }

    return resolved;
  }

  public getOperations()
  {
    return RelationType.operations.map;
  }

  public getId(): string
  {
    return RelationType.id;
  }

  public merge(type: RelationType, describer: TypeDescribeProvider): void
  {
    
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    return this.getResolvedType().getSubType(expr, def, context);
  }

  public getSubTypes(def: Definitions): TypeSub[]
  {
    return this.getResolvedType().getSubTypes(def);
  }

  public getExactType(value: any): Type 
  {
    return this.getResolvedType().getExactType(value);
  }

  public getSimplifiedType(): Type
  {
    return this.getResolvedType().getSimplifiedType();
  }

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean 
  {
    return this.getResolvedType().isCompatible(other, options);
  }

  public isOptional(): boolean
  {
    return !this.options.required;
  }

  public isSimple(): boolean
  {
    return !this.options.multiple && this.getResolvedType().isSimple();
  }

  protected acceptsOtherTypes(): boolean
  {
    return true;
  }
  
  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this, () => traverse.step('relatedType', this.getResolvedType()));
  }

  public setParent(parent: Type = null): void
  {
    this.parent = parent;

    this.getResolvedType().setParent(this);
  }

  public removeDescribedRestrictions(): void
  {
    this.getResolvedType().removeDescribedRestrictions();
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return this.getResolvedType().getCreateExpression(ex);
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return this.getResolvedType().getValidateExpression(ex);
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return this.getResolvedType().getCompareExpression(ex);
  }

  public isValid(value: any): boolean 
  {
    return this.getResolvedType().isValid(value);
  }

  public normalize(value: any): any
  {
    return this.getResolvedType().normalize(value);
  }

  public newInstance(): RelationType
  {
    return new RelationType({ relatedType: AnyType.baseType });
  }

  public clone(): RelationType
  {
    const relatedType = this.options.relatedType.clone();

    return new RelationType({
      ...this.options,
      relatedType
    });
  }

  public encode(): any 
  {
    return RelationType.encode(this);
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
