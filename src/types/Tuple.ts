
import { Type, TypeProvider, TypeDescribeProvider, TypeInput, TypeSub, TypeCompatibleOptions } from '../Type';
import { isArray, isNumber } from '../fns';
import { Exprs } from '../Exprs';
import { Expression } from '../Expression';
import { TupleOps, TupleOperations, TupleComputeds } from '../ops/TupleOps';
import { NumberOps } from '../ops/NumberOps';
import { DefinitionProvider } from '../DefinitionProvider';
import { ConstantExpression } from '../exprs/Constant';
import { NumberType } from './Number';
import { EnumType } from './Enum';
import { TextType } from './Text';
import { ID } from './ID';
import { Traverser, TraverseStep } from '../Traverser';
import { ListType } from './List';
import { ListOps } from '../ops/ListOps';
import { Types } from '../Types';
import { NullType } from './Null';


const INDEX_ELEMENTS = 1;

export class TupleType extends Type<Type[]>
{

  public static id = ID.Tuple;

  public static operations = TupleOperations;

  public static computeds = TupleComputeds;

  public static baseType = new TupleType([]);

  public static decode(data: any[], types: TypeProvider): TupleType 
  {
    const elements = data[INDEX_ELEMENTS].map((d: any) => types.getType(d));

    return new TupleType(elements);
  }

  public static encode(type: TupleType): any 
  {
    const elements = type.options.map(t => t.encode());

    return [this.id, elements];
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

  public static forItem(types: TypeInput[])
  {
    return new TupleType(types.map((t) => Types.parse(t)));
  }

  public getId(): string
  {
    return TupleType.id;
  }

  public getOperations()
  {
    return TupleType.operations.map;
  }

  public merge(type: TupleType): void
  {
    
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
        return this.options[expr.value];
      }
    }

    let exprType = expr.getType(def, context);

    if (exprType)
    {
      exprType = exprType.getRequired();

      if (exprType instanceof NumberType)
      {
        return Types.mergeMany(this.options, NullType.baseType);
      }

      if (exprType instanceof EnumType)
      {
        if (exprType.options.value instanceof NumberType)
        {
          const values = Array.from(exprType.options.constants.values());
          const types = values.map((i: number) => this.options[i]).filter(t => !!t);
          
          return Types.mergeMany(types, NullType.baseType);
        }

        if (exprType.options.value instanceof TextType)
        {
          const values = Array.from(exprType.options.constants.values());

          if (values.length === 1 && values[0] === 'length')
          {
            return Types.LENGTH;
          }
        }
      }
    }
  }

  public getSubTypes(def: DefinitionProvider): TypeSub[]
  {
    return [
      ...this.options.map((value, key) => ({ key, value })),
      { key: 'length', value: Types.LENGTH },
      {
        key: new EnumType({
          key: NumberType.baseType,
          value: NumberType.baseType,
          constants: new Map(
            this.options.map((prop, key) => [key, key]),
          ),
        }),
        value: Types.mergeMany(this.options, NullType.baseType),
      },
      { 
        key: Types.INDEX, 
        value: Types.optional(
          Types.mergeMany(this.options, NullType.baseType)
        ),
      },
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

  public getCreateExpression(): Expression
  {
    return Exprs.tuple(
      ...this.options.map((t) => t.getCreateExpression())
    );
  }

  public getValidateExpression(): Expression
  {
    return Exprs
      .op(TupleOps.isValid, {
        value: Exprs.get('value'),
      })
      .and(this.options.map((t, i) => Exprs
        .define({ value: Exprs.get('value', i) })
        .run(t.getValidateExpression()),
      ),
    );
  }

  public getCompareExpression(): Expression
  {
    return Exprs.or(
      Exprs.op(NumberOps.cmp, {
        value: Exprs.get('value', 'length'),
        test: Exprs.get('test', 'length'),
      }),
      ...this.options.map((t, i) => Exprs
        .define({
          value: Exprs.get('value', i),
          test: Exprs.get('test', i),
        })
        .run(t.getCompareExpression()),
      ),
    );
  }

  public getValueChangeExpression(newValue: Expression, from?: TraverseStep, to?: TraverseStep): Expression
  {
    // from & to = element index
    const hasFrom = isNumber(from);
    const hasTo = isNumber(to);

    if (!hasFrom && hasTo) // add
    {
      return Exprs.define({ parent: Exprs.get('value') },
        Exprs.op(ListOps.insert, {
          list: Exprs.get('value'),
          index: to,
          item: newValue,
        }),
      );
    } 
    else if (hasFrom && !hasTo) // remove
    {
      return Exprs.body(
        Exprs.op(ListOps.removeAt, {
          list: Exprs.get('value'),
          index: from,
        }),
        Exprs.get('value'),
      );
    }
    else if (from === to && hasFrom) // change
    { 
      return Exprs.body(
        Exprs.update('value', from)
          .to(newValue, 'value'),
        Exprs.get('value'),
      );
    }

    return newValue;
  }

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean 
  {
    if (!options.exact && 
      !options.strict && 
      other instanceof ListType && 
      !this.options.some(o => !o.isCompatible(other.options.item, options)) &&
      isNumber(other.options.min) &&
      other.options.min >= this.options.length)
    {
      return true;
    }

    if (!(other instanceof TupleType))
    {
      return false;
    }

    const a = this.options;
    const b = other.options;

    if (b.length < a.length || (options.exact && a.length !== b.length))
    {
      return false;
    }

    for (let i = 0; i < a.length; i++)
    {
      if (!a[i].isCompatible(b[i], options))
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
      this.options.map((type, index) => traverse.step(index, type, (replaceWith) => this.options.splice(index, 1, replaceWith), () => this.options.splice(index, 1)))
    );
  }

  public getTypeFromStep(step: TraverseStep): Type | null
  {
    return this.options[step] || null;
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

  public isValid(value: any): boolean 
  {
    if (!isArray(value))
    {
      return false;
    }

    const elements = this.options;

    for (let i = 0; i < elements.length; i++)
    {
      if (!elements[i].isValid(value[i]))
      {
        return false;
      }
    }

    return true;
  }

  public normalize(value: any): any
  {
    if (!isArray(value))
    {
      return value;
    }

    const elements = this.options;

    for (let i = 0; i < elements.length; i++)
    {
      value[i] = elements[i].normalize(value[i]);
    }

    return value;
  }

  public newInstance(): TupleType
  {
    return new TupleType([]);
  }

  public clone(): TupleType
  {
    return new TupleType(this.options.map(e => e.clone()));
  }

  public encode(): any 
  {
    return TupleType.encode(this);
  }

  public create(): any[]
  {
    return this.options.map(e => e.create());
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return this.options.map(e => e.random(rnd));
  }

  public fromJson(json: any[]): any[]
  {
    return this.options.map((e, i) => e.fromJson(json[i]));
  }

  public toJson(value: any[]): any[]
  {
    return this.options.map((e, i) => e.toJson(value[i]));
  }

}
