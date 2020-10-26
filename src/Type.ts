
import { isSameClass } from './fns';
import { Operations, OperationGeneric } from './Operation';
import { Expression } from './Expression';
import { DefinitionProvider } from './DefinitionProvider';
import { Traverser, Traversable, TraverseStep } from './Traverser';
import { Computeds } from './Computed';
import { ReferenceData } from './ReferenceData';



export type TypeInput = TypeClass | Type;

export type TypeInputMap = Record<string, TypeInput>;

export type TypeMap = Record<string, Type>;

export type TypeChild = string | number;

export interface TypeSub 
{ 
  key: string | number | Type;
  value: Type;
}

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
  getType(data: any, otherwise?: Type): Type;
  getExpression(data: any): Expression;
  getData(name: string): ReferenceData | null;
  setLegacy(): void;
}

export interface TypeDescribeProvider
{
  describe(data: any): Type;
  merge(type: Type, data: any): Type;
}

export interface TypeCompatibleOptions
{
  strict?: boolean;
  value?: boolean;
  exact?: boolean;
}

export interface TypeParser 
{
  (data: any, types: TypeProvider): Type;
}

export interface TypeClass<T extends Type<O> = any, O = any> 
{
  id: string;
  operations: Operations;
  computeds: Computeds;
  baseType: T;
  decode(this: TypeClass<T>, data: any[], types: TypeProvider): T;
  encode(this: TypeClass<T>, type: T): any;
  describePriority: number;
  describe(this: TypeClass<T>, data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | null;
  register(this: TypeClass<T>): void;
  registered: boolean;
  new(options: O, ...args: any[]): T;
}

export abstract class Type<O = any> implements Traversable<Type>
{

  public options: O;
  public parent: Type = null;

  public constructor(options: O) 
  {
    this.options = options;
  }

  public abstract getOperations(): Record<string, OperationGeneric>;

  public abstract getId(): string;

  public abstract merge(type: Type<O>): void;

  public abstract getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null;

  public abstract getSubTypes(def: DefinitionProvider): TypeSub[];

  public getChildType(name: TypeChild): Type | null
  {
    return null;
  }

  public getChildTypes(): TypeChild[]
  {
    return [];
  }

  public getParentOfType<T extends Type>(type: TypeClass<T>): T | null
  {
    let parent: Type = this.parent;

    while (parent)
    {
      if (parent.constructor === type)
      {
        return parent as T;
      }

      parent = parent.parent;
    }

    return null;
  }

  public abstract getExactType(value: any): Type<O>;

  public abstract getSimplifiedType(): Type;

  public getRequired(): Type
  {
    return this;
  }

  public isWrapper(): boolean
  {
    return false;
  }

  public getWrappedType(): Type
  {
    return this;
  }

  protected abstract isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;

  public isCompatible(other: Type, options: TypeCompatibleOptions = {}): boolean
  {
    if (other === this)
    {
      return true;
    }

    if (!options.exact && other.isWrapper() && this.isCompatible(other.getWrappedType(), options))
    {
      return true;
    }

    if (options.strict && !isSameClass(this, other) && !this.acceptsOtherTypes())
    {
      return false;
    }

    return this.isDeepCompatible(other, options);
  }

  protected acceptsOtherTypes(): boolean
  {
    return false;
  }

  public acceptsType(other: Type): boolean
  {
    return this.isCompatible(other, { strict: true });
  }

  public acceptsData(other: Type): boolean
  {
    return this.isCompatible(other, { strict: true, value: true });
  }

  public exactType(other: Type): boolean
  {
    return this.isCompatible(other, { exact: true, strict: true });
  }

  public exactData(other: Type): boolean
  {
    return this.isCompatible(other, { exact: true, strict: true, value: true });
  }

  public abstract isOptional(): boolean;

  public abstract isSimple(): boolean;

  public abstract traverse<R>(traverse: Traverser<Type, R>): R;

  public abstract setParent(parent?: Type): void;

  public abstract removeDescribedRestrictions(): void;

  public abstract getCreateExpression(): Expression;

  public abstract getValidateExpression(): Expression;

  public abstract getCompareExpression(): Expression;

  public getValueChangeExpression(newValue: Expression, from?: TraverseStep, to?: TraverseStep): Expression
  {
    return newValue;
  }

  public getValueChangeAt(newValue: Expression): Expression
  {
    let node: Type = this.parent;
    const path = this.getPath();

    while(node)
    {
      const step = path.pop();

      newValue = node.getValueChangeExpression(newValue, step, step);
      node = node.parent;
    }

    return newValue;
  }

  public getPath(): TraverseStep[]
  {
    return this.getRootType().traverse(new Traverser((type, _, path, traverser) =>
    {
      if (type === this)
      {
        traverser.stop(path.slice());
      }
    }));
  }

  public getTypeFromPath(path: TraverseStep[]): Type | null
  {
    if (path.length === 0)
    {
      return this;
    }
    
    const type = this.getTypeFromStep(path[0]);

    if (!type)
    {
      return null;
    }

    return type.getTypeFromPath(path.slice(1));
  }

  public getTypeFromStep(step: TraverseStep): Type | null
  {
    return null;
  }

  public getRootType(): Type
  {
    let node: Type = this;

    while (node.parent)
    {
      node = node.parent;
    }

    return node;
  }

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