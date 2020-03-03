

export type DataTypeRaw = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

export interface DataTypeComparator
{
  priority: number;
  type: DataTypeRaw;
  compare(a: any, b: any, compare: (a: any, b: any) => number): number | undefined;
}

export interface DataTypeEquality
{
  priority: number;
  type: DataTypeRaw;
  equals(a: any, b: any, equals: (a: any, b: any) => boolean): boolean | undefined;
}

export interface DataTypeCopier
{
  priority: number;
  copy(a: any, copier: (b: any) => any, setObjectCopy: (original: any, copy: any) => void): any | undefined;
}

export interface DataTypeJson<T = any>
{
  priority: number;
  toJson(value: T, toJson: (value: any) => any): any | undefined;
  fromJson(json: any, fromJson: (json: any) => any): T;
}

export enum CycleOption
{
  IGNORE,
  ERROR,
  ATTEMPT,
}

export class DataTypeRegistry
{

  public static TYPES: DataTypeRaw[] = [
    'boolean', 'number', 'bigint', 'string', 'symbol', 'object', 'undefined', 'function',
  ];

  private compareTypes: Record<DataTypeRaw, number>;
  private compareMap: Record<DataTypeRaw, DataTypeComparator[]>;
  private equalsMap: Record<DataTypeRaw, DataTypeEquality[]>;
  private copyList: DataTypeCopier[];
  private jsonList: DataTypeJson[];

  public constructor()
  {
    this.compareTypes = this.createTypeMap((_, index) => index);
    this.compareMap = this.createTypeMap(() => []);
    this.equalsMap = this.createTypeMap(() => []);
    this.copyList = [];
    this.jsonList = [];
  }

  public compare(a: any, b: any): number
  {
    const comparator = (x: any, y: any): number =>
    {
      const xtype = typeof x;
      const ytype = typeof y;

      if (xtype !== ytype)
      {
        return this.compareTypes[xtype] - this.compareTypes[ytype];
      }

      const compares = this.compareMap[xtype];

      for (const compare of compares)
      {
        const result = compare.compare(x, y, comparator);

        if (result !== undefined)
        {
          return result;
        }
      }

      return x === y ? 0 : x < y ? -1 : 1;
    };

    return comparator(a, b);
  }

  public getCompare(less: number, more: number): number
  {
    return less === 0 && more === 0
      ? 0
      : less < more ? 1 : -1;
  }

  public addCompare(compare: DataTypeComparator): this
  {
    return this.addToPriorityList(this.compareMap[compare.type], compare);
  }

  public equals(a: any, b: any): boolean
  {
    const equalitor = (x: any, y: any): boolean =>
    {
      if (x === y)
      {
        return true;
      }

      const xtype = typeof x;
      const ytype = typeof y;

      if (xtype !== ytype)
      {
        return false;
      }

      const equals = this.equalsMap[xtype];

      for (const equality of equals)
      {
        const result = equality.equals(x, y, equalitor);

        if (result !== undefined)
        {
          return result;
        }
      }

      return false;
    };

    return equalitor(a, b);
  }

  public addEquals(equals: DataTypeEquality): this
  {
    return this.addToPriorityList(this.equalsMap[equals.type], equals);
  }

  public copy<T>(x: T): T
  {
    if (!x) return x; // null, undefined, 0, '', NaN, false

    if (typeof x === 'object')
    {
      const copied = new Map();
      const copiers = this.copyList;

      const setObjectCopy = (original: any, copy: any) => 
      {
        copied.set(original, copy);
      };

      const copyObject = (a: any): any =>
      {
        if (!a) return a;

        if (typeof a === 'object')
        {
          const existing = copied.get(a);

          if (existing !== undefined)
          {
            return existing;
          }

          for (const copier of copiers)
          {
            const copierCopy = copier.copy(x, copyObject, setObjectCopy);
  
            if (copierCopy !== undefined)
            {
              return copierCopy;
            }
          }
        }

        return a;
      };

      return copyObject(x);
    }
  
    return x;
  }

  public addCopier(copier: DataTypeCopier): this
  {
    return this.addToPriorityList(this.copyList, copier);
  }

  public toJson<T>(value: T): any
  {
    if (!value) return value; // null, undefined, 0, '', NaN, false

    if (typeof value === 'object')
    {
      const parsers = this.jsonList;

      const jsonObject = (x: T): any =>
      {
        if (!x) return x; // null, undefined, 0, '', NaN, false

        if (typeof x === 'object')
        {
          for (const parser of parsers)
          {
            const result = parser.toJson(x, jsonObject);

            if (result !== undefined)
            {
              return result;
            }
          }
        }

        return x;
      };
      
      return jsonObject(value);
    }

    return value;
  }

  public fromJson<T>(json: any): T
  {
    if (!json) return json; // null, undefined, 0, '', NaN, false

    if (typeof json === 'object')
    {
      const parsers = this.jsonList;

      const jsonObject = (x: any): T =>
      {
        if (!x) return x; // null, undefined, 0, '', NaN, false

        if (typeof x === 'object')
        {
          for (const parser of parsers)
          {
            const result = parser.fromJson(x, jsonObject);

            if (result !== undefined)
            {
              return result;
            }
          }
        }
        
        return x;
      };

      return jsonObject(json);
    }

    return json;
  }

  public addJson<T>(json: DataTypeJson<T>): this
  {
    return this.addToPriorityList(this.jsonList, json);
  }

  private createTypeMap<V>(create: (type: DataTypeRaw, index: number) => V): Record<DataTypeRaw, V>
  {
    const map: Record<DataTypeRaw, V> = Object.create(null);
    
    DataTypeRegistry.TYPES.forEach((type, index) => 
    {
      map[type] = create(type, index);
    });

    return map;
  }

  private addToPriorityList<V extends { priority: number }>(list: V[], value: V): this
  {
    list.push(value);
    list.sort((a, b) => b.priority - a.priority);

    return this;
  }

}

export const DataTypes = new DataTypeRegistry();