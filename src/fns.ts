
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