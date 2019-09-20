
import { isNumber, isString, isArray, isMap, isObject, isDate } from '../../fns';
import { LiveContext, LiveResult, LiveCommand } from '.';




export function saveScope<K extends string>(context: LiveContext, scope: Record<string, K>): Record<K, any> 
{
  const popped = {} as Record<K, string>;

  for (const prop in scope) 
  {
    const alias = scope[prop];

    popped[alias] = context[alias]
  }

  return popped;
}

export function restoreScope<K extends string>(context: LiveContext, saved: Record<K, any>) 
{
  for (const prop in saved)
  { 
    if (saved[prop] === undefined)
    {
      delete context[prop];
    }
    else
    {
      context[prop] = saved[prop];
    }
  }
}

export function preserveScope<R = any>(context: LiveContext, props: string[], run: () => R): R
{
  const saved = props.map((p) => context[p]);

  const result = run();

  saved.forEach((last, i) => 
    last === undefined
      ? delete context[props[i]]
      : context[props[i]] = last
  );

  return result;
}

export function _optional (cmd: LiveCommand | undefined, context: LiveContext, defaultValue?: LiveResult): LiveResult 
{
  return cmd ? cmd(context) : defaultValue;
}

export function _bool (cmd: LiveCommand | undefined, context: LiveContext, defaultValue: boolean = false): boolean
{
  return cmd ? !!cmd(context) : defaultValue;
}

export function _typed<T> (isValid: (value: any) => value is T, invalidValueDefault: T) 
{
  return (cmd: LiveCommand | undefined, context: LiveContext, invalidValue: T = invalidValueDefault) => 
  {
    if (!cmd) 
    {
      return invalidValue;
    }

    const value = cmd(context);

    return isValid(value) ? value : invalidValue;
  };
}

export function _typedDynamic<T> (isValid: (value: any) => value is T, invalidValueDefault: () => T) 
{
  return (cmd: LiveCommand | undefined, context: LiveContext, invalidValue: () => T = invalidValueDefault) => 
  {
    if (!cmd) 
    {
      return invalidValue();
    }

    const value = cmd(context);

    return isValid(value) ? value : invalidValue();
  };
}

export const _number = _typed (isNumber, Number.NaN);

export const _numberMaybe = _typed<number | undefined> (isNumber, undefined);

export const _text = _typed (isString, '');

export const _textMaybe = _typed<string | undefined> (isString, undefined);

export const _list  = _typedDynamic<any[]> (isArray, () => []);

export const _map = _typedDynamic<Map<any, any>> (isMap, () => new Map());

export const _object = _typedDynamic<any>(isObject, () => ({}));

export const _date = _typedDynamic<Date>(isDate, () => new Date());


export function _asList(getValue: LiveCommand, context: LiveContext)
{
  return [ getValue(context) ];
}

export function _asMap(getValue: LiveCommand, context: LiveContext)
{
  return new Map([['value', getValue(context) ]]);
}

export function _asObject(getValue: LiveCommand, context: LiveContext)
{
  return { value: getValue(context) };
}

export function _asTuple(getValue: LiveCommand, context: any)
{
  return [ getValue(context) ];
}