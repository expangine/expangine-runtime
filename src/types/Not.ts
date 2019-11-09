
import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { AnyType } from './Any';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
import { ID } from './ID';
import { Traverser } from '../Traverser';
import { NoExpression } from '../exprs/No';


const INDEX_NOT = 1;

export class NotType extends Type<Type[]>
{

  public static id = ID.Not;

  public static operations = new Operations(ID.Not + ':');

  public static baseType = new NotType([AnyType.baseType]);

  public static decode(data: any[], types: TypeProvider): NotType 
  {
    const not = data[INDEX_NOT].map((d: any) => types.getType(d));

    return new NotType(not);
  }

  public static encode(type: NotType): any 
  {
    const not = type.options.map(t => t.encode());

    return [this.id, not];
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

  public getOperations()
  { 
    return {};
  }

  private forNot<T> (otherwise: T, handler: (type: Type) => T | undefined): T
  {
    const not = this.options;

    for (const type of not)
    {
      const result = handler(type);

      if (result !== undefined)
      {
        return result;
      } 
    }

    return otherwise;
  }

  public getId(): string
  {
    return NotType.id;
  }

  public merge(type: NotType, describer: TypeDescribeProvider): void
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

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean 
  {
    return this.forNot(true, not => not.isCompatible(other, options) ? false : undefined);
  }

  protected acceptsOtherTypes(): boolean
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
    return traverse.enter(this, () =>
      this.options.map((type, index) => traverse.step(index, type))
    );
  }

  public setParent(parent: Type = null): void
  {
    this.parent = parent;

    this.options.forEach(t => t.setParent(this));
  }

  public removeDescribedRestrictions(): void
  {
    this.options.forEach(t => t.removeDescribedRestrictions());
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return NoExpression.instance;
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return NoExpression.instance;
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return NoExpression.instance;
  }

  public isValid(value: any): boolean 
  {
    return this.forNot(true, many => many.isValid(value) ? false : undefined);
  }

  public normalize(value: any): any
  {
    return this.forNot(value, many => many.isValid(value) ? null : undefined);
  }

  public newInstance(): NotType
  {
    return new NotType([]);
  }

  public clone(): NotType
  {
    return new NotType(this.options.map(e => e.clone()));
  }

  public encode(): any 
  {
    return NotType.encode(this);
  }

  public create(): any
  {
    return null;
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return null;
  }

  public fromJson(json: any): any
  {
    return AnyType.baseType.fromJson(json);
  }

  public toJson(value: any): any
  {
    return AnyType.baseType.toJson(value);
  }

}
