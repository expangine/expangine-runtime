
import { isDate, isEmpty, copy } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Unit, parse, startOf, endOf } from '../util/DateFunctions';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { DateOps, DateOperations } from '../ops/DateOps';
import { Definitions } from '../Definitions';
import { ID } from './ID';
import { Traverser } from '../Traverser';


const INDEX_OPTIONS = 1;

export interface DateOptions 
{
  parseAsUTC?: boolean;
  validateMin?: Date;
  validateMax?: Date;
  forceMin?: Date;
  forceMax?: Date;
  forceStartOf?: Unit;
  forceEndOf?: Unit;
  withTime?: boolean;
}

export class DateType extends Type<DateOptions> 
{

  public static id = ID.Date;

  public static operations = DateOperations;

  public static baseType = new DateType({});

  public static decode(data: any[], types: TypeProvider): DateType 
  {
    return new DateType(this.decodeOptions(data[INDEX_OPTIONS] || {}));
  }

  public static encode(type: DateType): any 
  {
    return isEmpty(type.options)
      ? this.id
      : [this.id, this.encodeOptions(type.options)];
  }

  private static decodeOptions(options: any): DateOptions
  {
    if (options.validateMin) options.validateMin = new Date(options.validateMin);
    if (options.validateMax) options.validateMax = new Date(options.validateMax);
    if (options.forceMin) options.forceMin = new Date(options.forceMin);
    if (options.forceMax) options.forceMax = new Date(options.forceMax);

    return options;
  }

  private static encodeOptions(options: DateOptions): any
  {
    const encoded: any = { ...options };

    if (encoded.validateMin) encoded.validateMin = encoded.validateMin.toISOString();
    if (encoded.validateMax) encoded.validateMax = encoded.validateMax.toISOString();
    if (encoded.forceMin) encoded.forceMin = encoded.forceMin.toISOString();
    if (encoded.forceMax) encoded.forceMax = encoded.forceMax.toISOString();

    return encoded;
  }

  public static describePriority: number = 6;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    if (!isDate(data))
    {
      return null;
    }

    return new DateType({
      validateMin: new Date(data.getTime()),
      validateMax: new Date(data.getTime())
    });
  }

  public getId(): string
  {
    return DateType.id;
  }

  public getOperations()
  {
    return DateType.operations.map;
  }

  public merge(type: DateType, describer: TypeDescribeProvider): void
  {
    const o1 = this.options;
    const o2 = type.options;

    o1.parseAsUTC = o1.parseAsUTC && o2.parseAsUTC;
    
    if (o1.validateMin && o2.validateMin)
    {
      o1.validateMin.setTime(Math.min(o1.validateMin.getTime(), o2.validateMin.getTime()));
    }

    if (o1.validateMax && o2.validateMax)
    {
      o1.validateMax.setTime(Math.max(o1.validateMax.getTime(), o2.validateMax.getTime()));
    }
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

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions = {}): boolean 
  {
    if (!(other instanceof DateType))
    {
      return false;
    }

    if (options.value)
    {
      if (other.options.withTime && !this.options.withTime)
      {
        return false;
      }

      const min = this.getMin();
      const otherMin = other.getMin();

      if (min && (!otherMin || otherMin.getTime() < min.getTime()))
      {
        return false;
      }

      const max = this.getMax();
      const otherMax = other.getMax();

      if (max && (!otherMax || otherMax.getTime() > max.getTime()))
      {
        return false;
      }

      const { forceStartOf, forceEndOf } = this.options;

      if (forceStartOf && forceStartOf !== other.options.forceStartOf)
      {
        return false;
      }

      if (forceEndOf && forceEndOf !== other.options.forceEndOf)
      {
        return false;
      }
    }

    return true;
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this);
  }

  public setParent(parent?: Type): void
  {
    this.parent = parent;
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(DateOps.create, {});
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(DateOps.isValid, {
      value: ex.get('value'),
    });
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(DateOps.cmp, {
      value: ex.get('value'),
      test: ex.get('test'),
    });
  }

  public isValid(value: any): boolean 
  {
    const { parseAsUTC, validateMin, validateMax } = this.options;
    const parsed = parse(value, parseAsUTC);

    if (!parsed)
    {
      return false;
    }

    if (validateMin && parsed.getTime() < validateMin.getTime())
    {
      return false;
    }

    if (validateMax && parsed.getTime() > validateMax.getTime())
    {
      return false;
    }

    return true;
  }

  public normalize(value: any): any
  {
    const { parseAsUTC, forceMin, forceMax, forceStartOf, forceEndOf } = this.options;
    const parsed = parse(value, parseAsUTC);

    if (!parsed)
    {
      return value;
    }

    if (forceMin && parsed.getTime() < forceMin.getTime())
    {
      parsed.setTime(forceMin.getTime());
    }
    
    if (forceMax && parsed.getTime() > forceMax.getTime())
    {
      parsed.setTime(forceMax.getTime());
    }

    if (forceStartOf)
    {
      startOf[forceStartOf](parsed);
    }

    if (forceEndOf)
    {
      endOf[forceEndOf](parsed);
    }

    return parsed;
  }

  public newInstance(): DateType
  {
    return new DateType({});
  }

  public clone(): DateType
  {
    return new DateType(copy(this.options));
  }

  public encode(): any 
  {
    return DateType.encode(this);
  }

  public create(): any
  {
    return new Date();
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const value = new Date();

    const min = this.getMin();
    const max = this.getMax();

    const start = min ? min.getTime() : value.getTime();
    const end = max ? max.getTime() : value.getTime();

    return new Date(rnd(start, end, true));
  }

  public getMin(): Date | undefined
  {
    return this.options.validateMin || this.options.forceMin;
  }

  public getMax(): Date | undefined
  {
    return this.options.validateMax || this.options.forceMax;
  }

  public fromJson(json: string): Date
  {
    return new Date(json);
  }

  public toJson(value: Date): string
  {
    return value.toISOString();
  }

}
