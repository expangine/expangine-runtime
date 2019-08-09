
export function isNumber(value: any): value is number 
{
  return typeof value === 'number' && isFinite(value);
}

export function isString(value: any): value is string 
{
  return typeof value === 'string';
}

export function isArray<T = any>(value: any): value is T[] 
{
  return Array.isArray(value);
}

export function isDate(value: any): value is Date
{
  return value instanceof Date;
}

export function isMap<K, V>(value: any): value is Map<K, V>
{
  return value instanceof Map;
}

export function isBoolean(value: any): value is boolean 
{
  return typeof value === 'boolean';
}

export function isFunction(value: any): value is ((...args: any[]) => any) 
{
  return typeof value === 'function';
}

export function isObject(value: any): value is any 
{
  return typeof value === 'object' && !Array.isArray(value);
}

export function isUndefined(value: any): value is undefined 
{
  return typeof value === 'undefined';
}

export function isSameClass(a: any, b: any): boolean
{
  return a.constructor === b.constructor;
}

export function isEmpty(value: any): boolean 
{
  if (isArray(value)) 
  {
    return value.length === 0;
  }
  else if (isObject(value)) 
  {
    for (const _prop in value) 
    {
      return false;
    }

    return true;
  }

  return value === null || value === undefined;
}

export function mapObject<R, V>(map: Record<string, V>, getValue: (value: V, key: string) => R, getKey: (key: string, value: V) => string = ((key) => key) ): Record<string, R> 
{
  const mapped: Record<string, R> = {};

  for (const prop in map) 
  {
    const value = map[prop];
    mapped[getKey(prop, value)] = getValue(value, prop);
  }

  return mapped;
}

export function toArray<T>(iter: IterableIterator<T>): T[]
{
  const out: T[] = [];

  for (const item of iter) 
  { 
    out.push(item);
  }

  return out;
}

export function getCompare(less: number, more: number): number
{
  return less === 0 && more === 0
    ? 0
    : less < more ? 1 : -1;
}

export const COMPARE_TYPE_ORDER = {
  'boolean':    0,
  'number':     1,
  'bigint':     2,
  'string':     3,
  'symbol':     4,
  'object':     5,
  'undefined':  6,
  'function':   7
};

export function compare (a: any, b: any): number
{
  if (a === b) return 0;

  const at = typeof a;
  const bt = typeof b;

  if (at !== bt) return COMPARE_TYPE_ORDER[at] - COMPARE_TYPE_ORDER[bt];

  const al = isArray(a);
  const bl = isArray(b);

  if (al !== bl) return (al ? 1 : 0) - (bl ? 1 : 0);
  
  if (al)
  {
    return a.length - b.length;
  }

  switch (at)
  {
    case 'object':
      const ad = a instanceof Date;
      const bd = b instanceof Date;
  
      if (ad !== bd) return (ad ? 1 : 0) - (bd ? 1 : 0);
  
      if (ad) return a.getTime() - b.getTime();

      let less = 0;
      let more = 0;

      for (const prop in a) {
        if (!(prop in b)) {
          less++;
        }
      }

      for (const prop in b) {
        if (!(prop in a)) {
          more++;
        }
      }

      for (const prop in a) {
        if (prop in b)
        {
          const c = compare(a[prop], b[prop]);

          if (c < 0) less++;
          if (c > 0) more++;
        }
      }

      return getCompare(less, more);

    case 'bigint':
    case 'number':
      return a - b;
    
    case 'boolean':
      return (a ? 1 : 0) - (b ? 1 : 0);

    case 'string':
      return a.localeCompare(b);
  }

  return 0;
}

export function copy(x: any, originals: any[] = [], clones: any[] = []): any
{
  if (!x) return x; // null, undefined, 0, '', NaN, false

  if (isDate(x))
  {
    return new Date(x.getTime());
  }

  if (typeof x === 'object')
  {
    const i = originals.indexOf(x);

    if (i !== -1)
    {
      return clones[i];
    }

    if (isArray(x))
    {
      const arr: any[] = [];

      originals.push(x);
      clones.push(arr);

      for (const item of x)
      {
        arr.push(copy(item, originals, clones));
      }

      return arr;
    }

    const obj: any = {};

    originals.push(x);
    clones.push(obj);

    for (const prop in x) 
    {
      obj[prop] = copy(x[prop], originals, clones);
    }

    return obj;
  }

  return x;
}