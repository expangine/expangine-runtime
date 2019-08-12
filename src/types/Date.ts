
import { isDate, isEmpty } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { Unit, parse, startOf, endOf } from '../util/DateFunctions';


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
}

export class DateType extends Type<DateOptions> 
{

  public static id = 'date';

  public static operations = new Operations<DateType>('date:');

  public static baseType = new DateType({});

  public static decode(data: any[], types: TypeProvider): DateType 
  {
    return new DateType(data[INDEX_OPTIONS] || {});
  }

  public static encode(type: DateType): any 
  {
    return isEmpty(type.options)
      ? this.id
      : [this.id, type.options];
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

  public getSubTypes(): null
  {
    return null;
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    return other instanceof DateType;
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

  public encode(): any 
  {
    return DateType.encode(this);
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const { validateMin, validateMax, forceMin, forceMax } = this.options;
    const value = new Date();

    const min = validateMin || forceMin;
    const max = validateMax || forceMax;

    const start = min ? min.getTime() : value.getTime();
    const end = max ? max.getTime() : value.getTime();

    return new Date(rnd(start, end, true));
  }

}
