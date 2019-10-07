
import { toArray, compare } from '../fns';
import { Type, TypeDescribeProvider, TypeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { TextType } from './Text';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
import { ID } from './ID';
import { Traverser } from '../Traverser';


const INDEX_KEY = 1;
const INDEX_VALUE = 2;
const INDEX_CONSTANTS = 3;

export interface EnumOptions 
{
  key: Type;
  value: Type;
  constants: Map<any, any>;
}

export class EnumType extends Type<EnumOptions> 
{

  public static id = ID.Enum;

  public static operations = new Operations(ID.Enum + ':');
  
  public static baseType = new EnumType({ key: TextType.baseType, value: TextType.baseType, constants: new Map() });

  public static decode(data: any[], types: TypeProvider): EnumType 
  {
    const key = types.getType(data[INDEX_KEY]);
    const value = types.getType(data[INDEX_VALUE]);
    const constants = new Map(data[INDEX_CONSTANTS].map(([k, v]: [any, any]) => [
      key.fromJson(k),
      value.fromJson(v)
    ]));

    return new EnumType({ key, value, constants });
  }

  public static encode(type: EnumType): any 
  {
    const { key, value, constants } = type.options;

    return [
      this.id,
      key.encode(),
      value.encode(),
      toArray(constants.entries()).map(([k, v]) => [
        key.toJson(k),
        value.toJson(v)
      ])
    ];
  }

  public static describePriority: number = -1;
  
  public static describe(): Type | null
  {
    return null;
  }

  public getId(): string
  {
    return EnumType.id;
  }

  public getOperations()
  {
    return this.options.value.getOperations();
  }

  public merge(type: EnumType, describer: TypeDescribeProvider): void
  {
    const c1 = this.options.constants;
    const c2 = type.options.constants;

    this.options.key = describer.mergeType(this.options.key, type.options.key);
    this.options.value = describer.mergeType(this.options.value, type.options.value);

    for (const [key, value] of c2.entries())
    {
      c1.set(key, value);
    }
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    return this.options.value.getSubType(expr, def, context);
  }

  public getSubTypes(def: Definitions): TypeSub[]
  {
    return this.options.value.getSubTypes(def);
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public getSimplifiedType(): Type
  {
    return this.options.value;
  }

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions = {}): boolean 
  {
    if (!(other instanceof EnumType))
    {
      return false;
    }

    const { key, value } = this.options;

    if (options.exact)
    {
      if (!key.isCompatible(other.options.key, options))
      {
        return false;
      }
    }

    return value.isCompatible(other.options.value);
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step('key', this.options.key);
      traverse.step('value', this.options.value);
    });
  }

  public setParent(parent?: Type): void
  {
    this.parent = parent;

    this.options.key.setParent(this);
    this.options.value.setParent(this);
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return this.options.value.getCreateExpression(ex);
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return this.options.value.getValidateExpression(ex);
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return this.options.value.getCompareExpression(ex);
  }

  public isValid(test: any): boolean 
  {
    const { constants, value } = this.options;

    if (!value.isValid(test))
    {
      return false;
    }

    for (const constantValue of constants.values())
    {
      if (compare(constantValue, test) === 0)
      {
        return true;
      }
    }

    return false;
  }

  public normalize(value: any): any
  {
    return this.options.value.normalize(value);
  }

  public newInstance(): EnumType
  {
    const { key, value } = this.options;

    return new EnumType({
      key: key.newInstance(),
      value: value.newInstance(),
      constants: new Map(),
    });
  }

  public clone(): EnumType
  {
    const { key, value, constants } = this.options;

    return new EnumType({
      key: key.clone(),
      value: value.clone(),
      constants: new Map(constants.entries()),
    });
  }

  public encode(): any 
  {
    return EnumType.encode(this);
  }

  public create(): any
  {
    const { value, constants } = this.options;
    const firstKey = constants.keys().next();

    return firstKey ? constants.get(firstKey) : value.create();
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const values = toArray(this.options.constants.values());

    return values[rnd(0, values.length, true)];
  }

  public fromJson(json: any): any
  {
    return this.options.value.fromJson(json);
  }

  public toJson(value: any): any
  {
    return this.options.value.toJson(value);
  }

}