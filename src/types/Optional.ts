
import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeInput, TypeCompatibleOptions, TypeChild } from '../Type';
import { Operations } from '../Operation';
import { Exprs } from '../Exprs';
import { Expression } from '../Expression';
import { AnyOps } from '../ops/AnyOps';
import { DefinitionProvider } from '../DefinitionProvider';
import { ID } from './ID';
import { Traverser, TraverseStep } from '../Traverser';
import { Computeds } from '../Computed';
import { Types } from '../Types';
import { AnyType } from './Any';


const INDEX_TYPE = 1;
const RANDOM_CHANCE = 0.3;

export type OptionalInterface<T> = T | undefined | null;

export class OptionalType<T = any> extends Type<OptionalInterface<T>, Type<T>>
{

  public static STEP_OPTIONAL = 'optional';

  public static CHILD_OPTIONAL = 'optional';

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
  
  public static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | undefined
  {
    return undefined;
  }

  public static registered: boolean = false;

  public static register(): void
  {

  }

  public static for(type: TypeInput): OptionalType
  {
    return new OptionalType(Types.parse(type));
  }

  public getOperations()
  {
    return this.options.getOperations();
  }

  public getId(): string
  {
    return OptionalType.id;
  }

  public merge(type: OptionalType): void
  {
    
  }

  public getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | undefined
  {
    return this.options.getSubType(expr, def, context);
  }

  public getSubTypes(def: DefinitionProvider): TypeSub[]
  {
    return this.options.getSubTypes(def);
  }

  public getChildType(name: TypeChild): Type | undefined
  {
    return name === OptionalType.CHILD_OPTIONAL
      ? this.options
      : undefined;
  }

  public getChildTypes(): TypeChild[]
  {
    return [OptionalType.CHILD_OPTIONAL];
  }

  public getExactType(value: any): Type 
  {
    return this.options.getExactType(value);
  }

  public getSimplifiedType(): Type
  {
    return this;
  }

  public getRequired(): Type
  {
    return this.options;
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
    return traverse.enter(this, () => 
      traverse.step(OptionalType.STEP_OPTIONAL, this.options, (replaceWith) => this.options = replaceWith)
    );
  }

  public getTypeFromStep(step: TraverseStep): Type | undefined
  {
    return step === OptionalType.STEP_OPTIONAL
      ? this.options
      : undefined;
  }

  public setParent(parent?: Type): void
  {
    this.parent = parent;

    this.options.setParent(this);
  }

  public removeDescribedRestrictions(): void
  {
    this.options.removeDescribedRestrictions();
  }

  public getCreateExpression(): Expression
  {
    return this.options.getCreateExpression();
  }

  public getValidateExpression(): Expression
  {
    return Exprs.or(
      Exprs.op(AnyOps.isEqual, {
        value: Exprs.get('value'),
        test: Exprs.undefined(),
      }),
      this.options.getValidateExpression(),
    );
  }

  public getCompareExpression(): Expression
  {
    return Exprs.define({
      valueMissing: Exprs.op(AnyOps.isEqual, {
        value: Exprs.get('value'), 
        test: Exprs.undefined(),
      }),
      testMissing: Exprs.op(AnyOps.isEqual, {
        value: Exprs.get('test'), 
        test: Exprs.undefined(),
      }),
    }, Exprs
      .if(Exprs.and(Exprs.get('valueMissing'), Exprs.get('testMissing')))
      .than(Exprs.compareEqual())
      .if(Exprs.get('valueMissing'))
      .than(Exprs.compareLess())
      .if(Exprs.get('testMissing'))
      .than(Exprs.compareGreater())
      .else(this.options.getCompareExpression()),
    );
  }

  public getValueChangeExpression(newValue: Expression, from?: TraverseStep, to?: TraverseStep): Expression
  {
    // from & to = optional
    return Exprs
      .if(this.options.getValidateExpression())
      .than(newValue)
      .else(Exprs.get('value'))
    ;
  }

  public isValid(value: any): value is OptionalInterface<T>
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

  public newInstance(): OptionalType<T>
  {
    return new OptionalType(this.options.newInstance());
  }

  public clone(): OptionalType<T>
  {
    return new OptionalType(this.options.clone());
  }

  public encode(): any 
  {
    return OptionalType.encode(this);
  }

  public create(): OptionalInterface<T>
  {
    return this.options ? this.options.create() : undefined;
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): OptionalInterface<T>
  {
    return this.options && rnd(0, 1, false) > RANDOM_CHANCE
      ? this.options.random(rnd)
      : undefined;
  }

  public fromJson(json: any): OptionalInterface<T>
  {
    return json === undefined || json === null ? undefined : this.options.fromJson(json);
  }

  public toJson(value: OptionalInterface<T>): any
  {
    return value === undefined || value === null ? undefined : this.options.toJson(value);
  }

}
