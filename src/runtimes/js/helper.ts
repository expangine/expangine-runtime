
import { Command } from '../../Command';
import { isNumber, isString, isArray, isMap, isObject, isDate } from '../../fns';




export function saveScope<K extends string>(context: any, scope: Record<K, string>): Record<K, any> 
{
  const popped = {} as Record<K, string>;

  for (const prop in scope) 
  {
    popped[prop] = context[scope[prop]]
  }

  return popped;
}

export function restoreScope<K extends string>(context: any, saved: Record<K, any>) 
{
  for (const prop in saved)
  { 
    context[prop] = saved[prop];
  }
}

export function _optional (cmd: Command | undefined, context: object, defaultValue?: any): any 
{
  return cmd ? cmd(context) : defaultValue;
}

export function _bool (cmd: Command | undefined, context: object, defaultValue: boolean = false): boolean
{
  return cmd ? !!cmd(context) : defaultValue;
}

export function _typed<T> (isValid: (value: any) => value is T, invalidValueDefault: T) 
{
  return (cmd: Command | undefined, context: object, invalidValue: T = invalidValueDefault) => 
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
  return (cmd: Command | undefined, context: object, invalidValue: () => T = invalidValueDefault) => 
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