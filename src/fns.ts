
export type RecordKey = string | number | symbol;

export type MapInput<K = any, V = any> = 
  Map<K, V> | 
  Array<[K, V]> | 
  (K extends string | number | symbol ? Record<K, V> : never);

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

export function isSet<V>(value: any): value is Set<V>
{
  return value instanceof Set;
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

export function now(): number
{
  return new Date().getTime();
}

export function clamp(x: number, min: number, max: number): number
{
  return x < min ? min : x > max ? max : x;
}

export function toMap<K = any, V = any>(input?: MapInput<K, V>): Map<K, V>
{
  if (isArray(input))
  {
    return new Map(input);
  }
  else if (isMap(input))
  {
    return input;
  }
  else if (isObject(input))
  {
    return new Map(objectToArray(input, (v, k) => [k, v]));
  }
  
  return new Map();
}

export function reverseMap<K, V>(map: Map<K, V>): Map<V, K>
{
  return new Map(Array.from(map.entries()).map(([k, v]) => [v, k]));
}

export function arraySync<V, W = V>(
  target: V[],
  source: W[],
  matches: (target: V, source: W) => boolean,
  add: (target: V[], value: W) => void,
  remove: (target: V[], index: number, value: V) => void,
  update: (target: V[], index: number, value: V, newValue: W) => void,
): V[]
{
  const taken = source.map(() => false);

  for (let i = target.length - 1; i >= 0; i--)
  {
    const targetValue = target[i];
    const matchIndex = source.findIndex((sourceValue) => matches(targetValue, sourceValue));

    if (matchIndex !== -1)
    {
      update(target, i, targetValue, source[matchIndex]);

      taken[matchIndex] = true;
    }
    else
    {
      remove(target, i, targetValue);
    }
  }

  for (let i = 0; i < source.length; i++)
  {
    if (!taken[i])
    {
      add(target, source[i]);
    }
  }

  return target;
}

export function objectSync<V, K extends RecordKey = string>(
  target: Record<K, V>,
  source: Record<K, V>,
  add: (target: Record<K, V>, key: K, value: V) => void,
  remove: (target: Record<K, V>, key: K, value: V) => void,
  update: (target: Record<K, V>, key: K, value: V, withValue: V) => void,
): Record<K, V> 
{
 for (const key in target)
 {
   if (!(key in source))
   {
     remove(target, key, target[key]);
   }
 }

 for (const key in source)
 {
   if (key in target)
   {
     update(target, key, target[key], source[key]);
   }
   else
   {
     add(target, key, source[key]);
   }
 }

  return target;
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

export function objectFromProps<P extends string, V>(props: P[], getValue: (prop: P, index: number) => V): Record<P, V>
{
  const out = Object.create(null) as Record<P, V>;

  for (let i = 0; i < props.length; i++)
  {
    const prop = props[i];

    out[prop] = getValue(prop, i);
  }

  return out;
}

export function objectToArray<K extends RecordKey, V, T>(map: Record<K, V>, getItem: (value: V, key: K) => T): T[]
{
  const arr: T[] = [];

  for (const key in map)
  {
    arr.push(getItem(map[key], key));
  }

  return arr;
}


export function coalesce<T>(x?: T, y?: T): T
{
  return x === undefined ? y : x;
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