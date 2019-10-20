import { Expression, ExpressionValue, ExpressionMap } from './Expression';
import { ConstantExpression } from './exprs/Constant';

export type RecordKey = string | number | symbol;

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
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isUndefined(value: any): value is undefined 
{
  return typeof value === 'undefined';
}

export function isSameClass(a: any, b: any): boolean
{
  return a.constructor === b.constructor;
}

export function isWhole(x: number, epsilon: number = 0.000001): boolean
{
  return Math.abs(x - Math.round(x)) <= epsilon;
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

export function clamp(x: number, min: number, max: number): number
{
  return x < min ? min : x > max ? max : x;
}

export function toExpr(values: ExpressionValue[]): Expression[]
export function toExpr(values: Record<string, ExpressionValue>): ExpressionMap
export function toExpr(value: ExpressionValue): Expression
export function toExpr(value: ExpressionValue | ExpressionValue[] | Record<string, ExpressionValue>): Expression | Expression[] | ExpressionMap
{
  return isArray(value)
    ? value.map(toExpr)
    : value instanceof Expression 
      ? value
      : isObject(value)
        ? objectMap<Expression, ExpressionValue>(value, toExpr)
        : new ConstantExpression(value);
}


export function objectMap<R, V, K extends RecordKey = string, J extends RecordKey = K>(
  map: Record<K, V>, 
  getValue: (value: V, key: K) => R, 
  getKey: (key: K, value: V) => J = ((key) => key as unknown as J) ): Record<J, R> 
{
  return objectReduce(map, (value, key, out) => 
    (out[getKey(key, value)] = getValue(value, key), out)
  , Object.create(null));
}

export function objectEach<V, K extends RecordKey = string>(
  map: Record<K, V>, 
  onEach: (value: V, key: K, map: Record<K, V>) => any): void
{
  return objectReduce(map, (value, key) => 
    onEach(value, key, map)
  , undefined);
}

export function objectValues<V, M = V, K extends RecordKey = string>(
  map: Record<K, V>, 
  transform: (value: V, key: K) => M = ((v) => v as unknown as M)): M[]
{
  return objectReduce(map, (value, key, out) => 
    (out.push(transform(value, key)), out)
  , []);
}

export function objectReduce<R, V, K extends RecordKey = string>(
  map: Record<K, V>, 
  reduce: (value: V, key: K, reduced: R) => R, 
  initial: R): R
{
  for (const key in map)
  {
    initial = reduce(map[key], key, initial);
  }

  return initial;
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

export function coalesce<T>(x?: T, y?: T): T
{
  return x === undefined ? y : x;
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
    let dl = a.length - b.length;

    if (dl === 0)
    {
      let less = 0;
      let more = 0;

      for (let i = 0; i < a.length; i++)
      {
        const c = compare(a[i], b[i]);

        if (c < 0) less++;
        if (c > 0) more++;
      }

      dl = getCompare(less, more);
    }

    return dl;
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

export function padNumber(x: number, length: number, first: number = length)
{
  return pad(x + '', length, '0', true).substring( 0, first );
}

export function pad(x: string, length: number, padding: string, before: boolean): string
{
  while (x.length < length)
  {
    before ? x = padding + x : x = x + padding;
  }

  return x;
}

export function toString(x: any)
{
  return isArray(x) || isObject(x)
    ? JSON.stringify(x)
    : x + '';
}