
import { isNumber, isEmpty, isArray, coalesce } from '../fns';
import { Type, TypeProvider, TypeInput, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { NumberType } from './Number';
import { AnyType } from './Any';
import { Exprs } from '../Exprs';
import { Expression } from '../Expression';
import { ListOps, ListOperations, ListComputeds } from '../ops/ListOps';
import { DefinitionProvider } from '../DefinitionProvider';
import { ConstantExpression } from '../exprs/Constant';
import { EnumType } from './Enum';
import { TextType } from './Text';
import { ID } from './ID';
import { Traverser, TraverseStep } from '../Traverser';
import { TupleType } from './Tuple';
import { Types } from '../Types';
import { DataTypes, DataTypeRaw } from '../DataTypes';


const INDEX_ITEM = 1;
const INDEX_OPTIONS = 2;
const RANDOM_MIN = 2;
const RANDOM_MAX = 5;
const REQUIRED_SUB_MIN = 10;

export interface ListOptions 
{
  item: Type;
  min?: number;
  max?: number;
}

export class ListType extends Type<ListOptions> 
{

  public static STEP_ITEM = 'item';

  public static id = ID.List;

  public static operations = ListOperations;

  public static computeds = ListComputeds;

  public static baseType = new ListType({ item: AnyType.baseType });

  public static decode(data: any[], types: TypeProvider): ListType 
  {
    const item = types.getType(data[INDEX_ITEM]);
    const options = data[INDEX_OPTIONS] || {};

    return new ListType({ item, ...options });
  }

  public static encode(type: ListType): any 
  {
    const options: any = { ...type.options };
    const item = options.item;
    delete options.item;

    return isEmpty(options)
      ? [this.id, item.encode()]
      : [this.id, item.encode(), options];
  }

  public static describePriority: number = 6;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    if (!isArray(data))
    {
      return null;
    }

    let item = describer.describe(data[0]);

    for (let i = 1; i < data.length; i++)
    {
      item = describer.merge(item, data[i]);
    }

    return new ListType({ 
      item,
      min: data.length,
      max: data.length
    });
  }

  public static registered: boolean = false;

  public static register(): void
  {
    const priority = 8;
    const type: DataTypeRaw = 'object';

    DataTypes.addJson({
      priority,
      toJson: (json, writer) => {
        if (isArray(json)) {
          return json.map(writer);
        }
      },
      fromJson: (json, reader) => {
        if (isArray(json)) {
          return json.map(reader);
        }
      },
    });

    DataTypes.addCompare({
      priority,
      type,
      compare: (a, b, compare) => {
        const at = isArray(a);
        const bt = isArray(b);

        if (at !== bt) return (at ? 1 : 0) - (bt ? 1 : 0);
        
        if (at) {
          let dl = a.length - b.length;

          if (dl === 0) {
            let less = 0;
            let more = 0;

            for (let i = 0; i < a.length; i++) {
              const c = compare(a[i], b[i]);

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
        const al = isArray(a);
        const bl = isArray(b);

        if (al !== bl) return false;
        
        if (al)
        {
          if (a.length !== b.length)
          {
            return false
          }

          for (let i = 0; i < a.length; i++)
          {
            if (!equals(a[i], b[i]))
            {
              return false
            }
          }

          return true;
        }
      },
    });

    DataTypes.addCopier({
      priority,
      copy: (x, copy, setObjectCopy) => {
        if (isArray(x)) {
          const newArray: any[] = [];

          setObjectCopy(x, newArray);

          for (const item of x) {
            newArray.push(copy(item));
          }

          return newArray;
        }
      },
    });
  }

  public static forItem(itemOrClass: TypeInput)
  {
    const item = Types.parse(itemOrClass);
    
    return new ListType({ item });
  }

  public getId(): string
  {
    return ListType.id;
  }

  public getOperations()
  {
    return ListType.operations.map;
  }

  public merge(type: ListType): void
  {
    const o1 = this.options;
    const o2 = type.options;

    o1.item = Types.merge(o1.item, o2.item);
    o1.min = Math.min(o1.min, o2.min);
    o1.max = Math.max(o1.max, o2.max);
  }

  public getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null
  {
    if (ConstantExpression.is(expr))
    {
      if (expr.value === 'length')
      {
        return Types.LENGTH;
      }

      if (isNumber(expr.value))
      {
        return isNumber(this.options.min) && expr.value < this.options.min
          ? this.options.item
          : Types.optional(this.options.item);
      }
    }

    let exprType = expr.getType(def, context);

    if (exprType)
    {
      exprType = exprType.getRequired();

      if (exprType instanceof NumberType)
      {
        return Types.optional(this.options.item);
      }

      if (exprType instanceof EnumType)
      {
        const values = Array.from(exprType.options.constants.values());

        if (exprType.options.value instanceof NumberType)
        {
          if (isNumber(this.options.min) && !values.some((x) => x >= this.options.min))
          {
            return this.options.item;
          }

          return Types.optional(this.options.item);
        }

        if (exprType.options.value instanceof TextType)
        {
          if (values.length === 1 && values[0] === 'length')
          {
            return Types.LENGTH;
          }
        }
      }
    }

    return null;
  }

  public getSubTypes(def: DefinitionProvider): TypeSub[]
  {
    const { min, item } = this.options;
    const requiredMin = isNumber(min) && min > 0 && min <= REQUIRED_SUB_MIN ? min : 0;
    const required: TypeSub[] = [];

    for (let i = 0; i < requiredMin; i++) {
      required.push({ key: i, value: item });
    }

    return [
      ...required,
      { key: 'length', value: Types.LENGTH },
      { key: Types.INDEX, value: Types.optional(item) },
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
    const { item, min, max } = this.options;

    if (!options.strict &&
      !options.exact &&
      other instanceof TupleType &&
      !other.options.some(o => !item.isCompatible(o, options)))
    {
      return true;
    }

    if (!(other instanceof ListType))
    {
      return false;
    }

    if (!item.isCompatible(other.options.item, options))
    {
      return false;
    }

    if (options.value)
    {
      const otherMin = other.options.min;

      if (min && (!otherMin || otherMin < min))
      {
        return false;
      }

      const otherMax = other.options.max;

      if (max && (!otherMax || otherMax < max))
      {
        return false;
      }
    }

    return true;
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
    return traverse.enter(this, () => 
      traverse.step(ListType.STEP_ITEM, this.options.item, (replaceWith) => this.options.item = replaceWith)
    );
  }

  public getTypeFromStep(step: TraverseStep): Type | null
  {
    return step === ListType.STEP_ITEM 
      ? this.options.item 
      : null;
  }

  public setParent(parent: Type = null): void
  {
    this.parent = parent;

    this.options.item.setParent(this);
  }

  public removeDescribedRestrictions(): void
  {
    const { item } = this.options;

    item.removeDescribedRestrictions();

    this.options = { item };
  }

  public getCreateExpression(): Expression
  {
    return Exprs.op(ListOps.create, {});
  }

  public getValidateExpression(): Expression
  {
    return Exprs.and(
      Exprs.op(ListOps.isValid, {
        value: Exprs.get('value'),
      }),
      Exprs.not(Exprs.op(ListOps.contains, {
        list: Exprs.get('value'),
        item: Exprs.null(),
        isEqual: Exprs.not(this.options.item.getValidateExpression()),
      }, {
        value: 'ignore',
        test: 'value',
      })),
    );
  }

  public getCompareExpression(): Expression
  {
    return Exprs.op(ListOps.cmp, {
      value: Exprs.get('value'),
      test: Exprs.get('test'),
      compare: this.options.item.getCompareExpression(),
    });
  }

  public getValueChangeExpression(newValue: Expression, from?: TraverseStep, to?: TraverseStep): Expression
  {
    // from & to = item
    return Exprs.op(ListOps.map, {
      list: Exprs.get('value'),
      transform: newValue,
    }, {
      item: 'value',
    });
  }

  public isValid(value: any): boolean 
  {
    if (!Array.isArray(value)) 
    {
      return false;
    }

    const { item, min, max } = this.options;

    if (isNumber(min) && value.length < min) 
    {
      return false;
    }

    if (isNumber(max) && value.length > max) 
    {
      return false;
    }

    for (const val of value)
    {
      if (!item.isValid(val)) 
      {
        return false;
      }
    }

    return true;
  }

  public normalize(value: any): any
  {
    if (isArray(value))
    {
      const item = this.options.item; 

      for (let i = 0; i < value.length; i++)
      {
        value[i] = item.normalize(value[i]);
      }
    }
    
    return value;
  }

  public newInstance(): ListType
  {
    const { item } = this.options;

    return new ListType({
      item: item.newInstance(),
    });
  }

  public clone(): ListType
  {
    const { item, min, max } = this.options;

    return new ListType({
      item: item.clone(),
      min,
      max,
    });
  }

  public encode(): any 
  {
    return ListType.encode(this);
  }

  public create(): any[]
  {
    return [];
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const { min, max } = this.options;
    const chosenMin = coalesce(min, RANDOM_MIN);
    const chosenMax = coalesce(max, RANDOM_MAX);
    const start = Math.min(chosenMin, chosenMax);
    const end = Math.max(chosenMin, chosenMax);
    const n = rnd(start, end + 1, true);
    const out: any[] = [];

    for (let i = 0; i < n; i++)
    {
      out.push(this.options.item.random(rnd));
    }

    return out;
  }

  public fromJson(json: any[]): any[]
  {
    return json ? json.map((e: any) => this.options.item.fromJson(e)) : null;
  }

  public toJson(value: any[]): any[]
  {
    return value ? value.map((e: any) => this.options.item.toJson(e)) : null;
  }

}