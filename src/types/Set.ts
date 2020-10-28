
import { isObject, isArray, isSet, isString } from '../fns';
import { Type, TypeProvider, TypeInput, TypeDescribeProvider, TypeSub, TypeCompatibleOptions, TypeChild } from '../Type';
import { AnyType } from './Any';
import { Exprs } from '../Exprs';
import { Expression } from '../Expression';
import { SetOps, SetOperations, SetComputeds } from '../ops/SetOps';
import { ListOps } from '../ops/ListOps';
import { DefinitionProvider } from '../DefinitionProvider';
import { ID } from './ID';
import { Traverser, TraverseStep } from '../Traverser';
import { Types } from '../Types';
import { DataTypeRaw, DataTypes } from '../DataTypes';


const INDEX_VALUE = 1;
const RANDOM_MIN = 2;
const RANDOM_MAX = 5;

export interface SetOptions<V> 
{
  value: Type<V>;
}

export class SetType<V = any> extends Type<Set<V>, SetOptions<V>>
{

  public static STEP_VALUE = 'value';

  public static CHILD_VALUE = 'value';

  public static id = ID.Set;

  public static operations = SetOperations;

  public static computeds = SetComputeds;

  public static baseType = new SetType({ value: AnyType.baseType });

  public static decode(data: any[], types: TypeProvider): SetType 
  {
    const value = types.getType(data[INDEX_VALUE]);
    
    return new SetType({ value });
  }

  public static encode(type: SetType): any 
  {
    const { value } = type.options;

    return [this.id, value.encode()];
  }

  public static describePriority: number = 7;
  
  public static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | null
  {
    if (!isSet(data))
    {
      return null;
    }

    let value: Type = new AnyType({});

    const type = new SetType({ value });

    cache.set(data, type);

    for (const [setValue] of data.entries())
    {
      value = describer.merge(value, setValue);
    }

    type.options.value = value;

    return type;
  }

  public static registered: boolean = false;

  public static register(): void
  {
    const priority = 11;
    const type: DataTypeRaw = 'object';

    DataTypes.addJson({
      priority,
      fromJson: (json, reader) => {
        if (isObject(json) && isString(json.$any) && json.$any === 'set') {
          return new Set(json.value.map(reader));
        }
      },
      toJson: (json, writer) => {
        if (isSet(json)) {
          return {
            $any: 'set',
            value: Array.from(json.entries()).map(writer),
          };
        }
      },
    });

    DataTypes.addCopier({
      priority,
      copy: (x, copy, setObjectCopy) => {
        if (isSet(x)) {
          const newSet = new Set();

          setObjectCopy(x, newSet);
  
          for (const [value] of x.entries()) {
            newSet.add(copy(value));
          }
  
          return newSet;
        }
      },
    });

    DataTypes.addCompare({
      priority,
      type,
      compare: (a, b, compare) => {
        const at = isSet(a);
        const bt = isSet(b);

        if (at !== bt) return (at ? 1 : 0) - (bt ? 1 : 0);
        
        if (isSet(a) && isSet(b)) {
          let dl = a.size - b.size;

          if (dl === 0) {
            let less = 0;
            let more = 0;

            const avalues = Array.from(a);
            const bvalues = Array.from(b);

            for (let i = 0; i < avalues.length; i++) {
              const c = compare(avalues[i], bvalues[i]);

              if (c < 0) less++;
              if (c > 0) more++;
            }

            dl = DataTypes.getCompare(less, more);
          }

          return dl;
        }
      },
    });

    DataTypes.addEquals({
      priority,
      type,
      equals: (a, b, equals) => {
        const al = isSet(a);
        const bl = isSet(b);

        if (al !== bl) return false;
        
        if (isSet(a) && isSet(b))
        {
          if (a.size !== b.size)
          {
            return false
          }

          for (const value of a)
          {
            if (!b.has(value))
            {
              return false;
            }
          }

          return true;
        }
      },
    });
  }

  public static forItem(valueOrClass: TypeInput)
  {
    const value = Types.parse(valueOrClass);
    
    return new SetType({ value });
  }

  public getId(): string
  {
    return SetType.id;
  }

  public getOperations()
  {
    return SetType.operations.map;
  }

  public merge(type: SetType): void
  {
    const o1 = this.options;
    const o2 = type.options;

    o1.value = Types.merge(o1.value, o2.value);
  }

  public getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null
  {
    return null;
  }

  public getSubTypes(def: DefinitionProvider): TypeSub[]
  {
    return [];
  }

  public getChildType(name: TypeChild): Type | null
  {
    return name === SetType.CHILD_VALUE
      ? this.options.value
      : null;
  }

  public getChildTypes(): TypeChild[]
  {
    return [SetType.CHILD_VALUE];
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
    return other instanceof SetType && 
      this.options.value.isCompatible(other.options.value, options);
  }

  public isOptional(): boolean
  {
    return false;
  }

  public isSimple(): boolean
  {
    return false;
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(SetType.STEP_VALUE, this.options.value, (replaceWith) => this.options.value = replaceWith);
    });
  }

  public getTypeFromStep(step: TraverseStep): Type | null
  {
    return step === SetType.STEP_VALUE 
      ? this.options.value
      : null;
  }

  public setParent(parent: Type = null): void
  {
    this.parent = parent;

    this.options.value.setParent(this);
  }

  public removeDescribedRestrictions(): void
  {
    this.options.value.removeDescribedRestrictions();
  }

  public getCreateExpression(): Expression
  {
    return Exprs.op(SetOps.create, {});
  }

  public getValidateExpression(): Expression
  {
    return Exprs.and(
      Exprs.op(SetOps.isValid, {
        value: Exprs.get('value'),
      }),
      Exprs.not(Exprs.op(ListOps.contains, {
        list: Exprs.op(SetOps.values, { set: Exprs.get('value') }),
        item: Exprs.null(),
        isEqual: Exprs.not(this.options.value.getValidateExpression()),
      }, {
        value: 'ignore',
        test: 'value',
      })),
    );
  }

  public getCompareExpression(): Expression
  {
    return Exprs.op(SetOps.cmp, {
      value: Exprs.get('value'),
      test: Exprs.get('test'),
    });
  }

  public getValueChangeExpression(newValue: Expression, from?: TraverseStep, to?: TraverseStep): Expression
  {
    // from & to = value
    return Exprs.op(SetOps.map, {
      set: Exprs.get('value'),
      transform: newValue,
    }, {
      value: 'value',
    });
  }

  public isValid(test: any): test is Set<V>
  {
    if (test instanceof Set || isArray(test))
    {
      const { value } = this.options;

      return !Array.from(test).some((v) => !value.isValid(v));
    }

    return false;
  }

  public normalize(test: any): any
  {
    const { value } = this.options;
    
    return new Set(Array.from(test).map((v) => value.normalize(v)));
  }

  public newInstance(): SetType
  {
    const { value } = this.options;

    return new SetType({
      value: value.newInstance(),
    });
  }

  public clone(): SetType
  {
    const { value } = this.options;

    return new SetType({
      value: value.clone(),
    });
  }

  public encode(): any 
  {
    return SetType.encode(this);
  }

  public create(): Set<any>
  {
    return new Set();
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const { value } = this.options;
    const n = rnd(RANDOM_MIN, RANDOM_MAX + 1, true);
    const out = new Set<any>();

    for (let i = 0; i < n; i++)
    {
      const v = value.random(rnd);

      out.add(v);
    }

    return out;
  }

  public fromJson(json: Array<V>): Set<V>
  {
    const { value } = this.options;

    return new Set(json.map((v) => value.fromJson(v)));
  }

  public toJson(set: Set<V>): Array<V>
  {
    const { value } = this.options;

    return Array.from(set.values()).map((v) => value.toJson(v));
  }

}