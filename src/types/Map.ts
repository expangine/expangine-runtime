
import { isObject, isMap, toArray, isSameClass, isString } from '../fns';
import { Type, TypeProvider, TypeInput, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { AnyType } from './Any';
import { TextType } from './Text';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { MapOps, MapOperations } from '../ops/MapOps';
import { ListOps } from '../ops/ListOps';
import { Definitions } from '../Definitions';
import { ConstantExpression } from '../exprs/Constant';
import { ID } from './ID';
import { Traverser } from '../Traverser';


const INDEX_VALUE = 1;
const INDEX_KEY = 2;
const RANDOM_MIN = 2;
const RANDOM_MAX = 5;

export interface MapOptions 
{
  key: Type;
  value: Type;
}

export class MapType extends Type<MapOptions> 
{

  public static id = ID.Map;

  public static operations = MapOperations;

  public static baseType = new MapType({ key: TextType.baseType, value: AnyType.baseType });

  public static decode(data: any[], types: TypeProvider): MapType 
  {
    const value = types.getType(data[INDEX_VALUE]);
    const key = data[INDEX_KEY] ? types.getType(data[INDEX_KEY]) : TextType.baseType;

    return new MapType({ key, value });
  }

  public static encode(type: MapType): any 
  {
    const { key, value } = type.options;

    return key !== TextType.baseType
      ? [this.id, value.encode()]
      : [this.id, value.encode(), key.encode()];
  }

  public static describePriority: number = 7;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    if (!isMap(data))
    {
      return null;
    }

    let key: Type = new AnyType({});
    let value: Type = new AnyType({});

    for (const [entryKey, entryValue] of data.entries())
    {
      key = describer.merge(key, entryKey);
      value = describer.merge(value, entryValue);
    }

    return new MapType({ key, value });
  }

  public static forItem(valueOrClass: TypeInput, keyOrClass: TypeInput = TextType)
  {
    const value = Type.fromInput(valueOrClass);
    const key = Type.fromInput(keyOrClass);
    
    return new MapType({ key, value });
  }

  public getId(): string
  {
    return MapType.id;
  }

  public getOperations()
  {
    return MapType.operations.map;
  }

  public merge(type: MapType, describer: TypeDescribeProvider): void
  {
    const o1 = this.options;
    const o2 = type.options;

    o1.key = describer.mergeType(o1.key, o2.key);
    o1.value = describer.mergeType(o1.value, o2.value);
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    if (ConstantExpression.is(expr))
    {
      if (this.options.key.isValid(expr.value))
      {
        return this.options.value;
      }
    }

    const exprType = def.requiredType(expr.getType(def, context));

    if (exprType)
    {
      if (isSameClass(exprType, this.options.key))
      {
        return this.options.value;
      }
    }

    return null;
  }

  public getSubTypes(def: Definitions): TypeSub[]
  {
    return [
      { key: this.options.key, value: this.options.value },
    ];
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
    return other instanceof MapType && 
      this.options.key.isCompatible(other.options.key, options) && 
      this.options.value.isCompatible(other.options.value, options);
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step('key', this.options.key);
      traverse.step('value', this.options.value);
    });
  }

  public setParent(parent: Type = null): void
  {
    this.parent = parent;

    this.options.key.setParent(this);
    this.options.value.setParent(this);
  }

  public removeDescribedRestrictions(): void
  {
    this.options.key.removeDescribedRestrictions();
    this.options.value.removeDescribedRestrictions();
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(MapOps.create, {});
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.and(
      ex.op(MapOps.isValid, {
        value: ex.get('value'),
      }),
      ex.not(ex.op(ListOps.contains, {
        list: ex.op(MapOps.values, { map: ex.get('value') }),
        item: ex.null(),
        isEqual: ex.not(this.options.value.getValidateExpression(ex)),
      }, {
        value: 'ignore',
        test: 'value',
      })),
      ex.not(ex.op(ListOps.contains, {
        list: ex.op(MapOps.keys, { map: ex.get('value') }),
        item: ex.null(),
        isEqual: ex.not(this.options.key.getValidateExpression(ex)),
      }, {
        value: 'ignore',
        test: 'value',
      })),
    );
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(MapOps.cmp, {
      value: ex.get('value'),
      test: ex.get('test'),
      compare: this.options.value.getValidateExpression(ex),
    });
  }

  public isValid(test: any): boolean 
  {
    if (test instanceof Map && isObject(test))
    {
      const { key, value } = this.options;

      return this.iterate(test, true, (k, v) => {
        if (!key.isValid(k) || !value.isValid(v)) {
          return false;
        }
      });
    }

    return false;
  }

  public normalize(test: any): any
  {
    const { key, value } = this.options;
    const entries: [any, any][] = [];

    this.iterate(test, undefined, (k, v) => {
      entries.push([
        key.normalize(k),
        value.normalize(v)
      ]);
    });

    return new Map(entries);
  }

  private iterate<R>(map: any, otherwise: R, onItem: (key: any, value: any) => R): R
  {
    if (map instanceof Map)
    {
      for (const [key, value] of map.entries())
      {
        const result = onItem(key, value);

        if (result !== undefined)
        {
          return result;
        }
      }
    }
    else if (isObject(map))
    {
      for (const prop of map)
      {
        const result = onItem(prop, map[prop]);

        if (result !== undefined)
        {
          return result;
        }
      }
    }
    
    return otherwise;
  }

  public newInstance(): MapType
  {
    const { key, value } = this.options;

    return new MapType({
      key: key.newInstance(),
      value: value.newInstance(),
    });
  }

  public clone(): MapType
  {
    const { key, value } = this.options;

    return new MapType({
      key: key.clone(),
      value: value.clone(),
    });
  }

  public encode(): any 
  {
    return MapType.encode(this);
  }

  public create(): Map<any, any>
  {
    return new Map();
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const { key, value } = this.options;
    const n = rnd(RANDOM_MIN, RANDOM_MAX + 1, true);
    const out = new Map<any, any>();

    for (let i = 0; i < n; i++)
    {
      const k = key.random(rnd);
      const v = value.random(rnd);

      out.set(k, v);
    }

    return out;
  }

  public fromJson(json: Array<[any, any]>): Map<any, any>
  {
    const { key, value } = this.options;

    return new Map(json.map(([k, v]) => [
      key.fromJson(k),
      value.fromJson(v)
    ]));
  }

  public toJson(map: Map<any, any>): Array<[any, any]>
  {
    const { key, value } = this.options;

    return toArray(map.entries()).map(([k, v]) => [
      key.toJson(k),
      value.toJson(v)
    ]);
  }

}

const ANY_TYPE_PRIORITY = 10;

AnyType.addJsonReader(ANY_TYPE_PRIORITY, (json, reader) => {
  if (isObject(json) && isString(json.$any) && json.$any === 'map') {
    return new Map(json.value.map(([key, value]: [any, any]) => [reader(key), reader(value)]));
  }
});

AnyType.addJsonWriter(ANY_TYPE_PRIORITY, (json, writer) => {
  if (isMap(json)) {
    return {
      $any: 'map',
      value: toArray(json.entries())
        .map(([k, v]: [any, any]) => [writer(k), writer(v)])
    };
  }
});