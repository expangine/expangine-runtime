
import { isDate, isEmpty, isNumber, isString } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';


const INDEX_OPTIONS = 1;

export interface DateOptions 
{
  parseAsUTC?: boolean;
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
    return isDate(data) ? this.baseType : null;
  }

  public merge(type: DateType, describer: TypeDescribeProvider): void
  {
    const o1 = this.options;
    const o2 = type.options;

    o1.parseAsUTC = o1.parseAsUTC && o2.parseAsUTC;
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
    return isDate(this.normalize(value));
  }

  public normalize(value: any): any
  {
    if (isDate(value))
    {
      return value;
    }

    if (isNumber(value) && value > 0)
    {
      return new Date(value);
    }

    if (isString(value))
    {
      if (this.options.parseAsUTC)
      {
        const withUTC = value + ' UTC';
        const parsedUTC = Date.parse(withUTC);

        if (isFinite(parsedUTC))
        {
          return new Date(parsedUTC);
        }
      }

      const parsed = Date.parse(value);

      if (isFinite(parsed))
      {
        return new Date(parsed);
      }
    }

    return value;
  }

  public encode(): any 
  {
    return DateType.encode(this);
  }

}
