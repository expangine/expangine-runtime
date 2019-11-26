
import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeInput, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { AnyType } from './Any';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { AnyOps } from '../ops/AnyOps';
import { Definitions } from '../Definitions';
import { ID } from './ID';
import { Traverser } from '../Traverser';
import { Computeds } from '../Computed';


const INDEX_TYPE = 1;
const RANDOM_CHANCE = 0.3;

export class OptionalType extends Type<Type>
{

  public static id = ID.Optional;

  public static operations = new Operations(ID.Optional + ID.Delimiter);

  public static computeds = new Computeds(ID.Optional + ID.Delimiter);

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

  public static registered: boolean = false;

  public static register(): void
  {

  }

  public static for(type: TypeInput): OptionalType
  {
    return new OptionalType(Type.fromInput(type));
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

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    return this.options.getSubType(expr, def, context);
  }

  public getSubTypes(def: Definitions): TypeSub[]
  {
    return this.options.getSubTypes(def);
  }

  public getExactType(value: any): Type 
  {
    return this.options.getExactType(value);
  }

  public getSimplifiedType(): Type
  {
    return this;
  }

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean 
  {
    return other instanceof OptionalType
      ? this.options.isCompatible(other.options, options)
      : this.options.isCompatible(other, options);
  }

  public isOptional(): boolean
  {
    return true;
  }

  public isSimple(): boolean
  {
    return this.options.isSimple();
  }

  protected acceptsOtherTypes(): boolean
  {
    return true;
  }
  
  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this, () => traverse.step('optional', this.options));
  }

  public setParent(parent: Type = null): void
  {
    this.parent = parent;

    this.options.setParent(this);
  }

  public removeDescribedRestrictions(): void
  {
    this.options.removeDescribedRestrictions();
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return this.options.getCreateExpression(ex);
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.or(
      ex.op(AnyOps.isEqual, {
        value: ex.get('value'),
        test: ex.undefined(),
      }),
      this.options.getValidateExpression(ex),
    );
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return ex.define({
      valueMissing: ex.op(AnyOps.isEqual, {
        value: ex.get('value'), 
        test: ex.undefined(),
      }),
      testMissing: ex.op(AnyOps.isEqual, {
        value: ex.get('test'), 
        test: ex.undefined(),
      }),
    }, ex
      .if(ex.and(ex.get('valueMissing'), ex.get('testMissing')))
      .than(ex.compareEqual())
      .if(ex.get('valueMissing'))
      .than(ex.compareLess())
      .if(ex.get('testMissing'))
      .than(ex.compareGreater())
      .else(this.options.getCompareExpression(ex)),
    );
  }

  public isValid(value: any): boolean 
  {
    return value === null 
      || value === undefined
      || this.options.isValid(value);
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
