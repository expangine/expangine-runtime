
import { Command } from '../../Command';
import { isNumber, isString, isArray } from '../../fns';




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

export function optional (cmd: Command | undefined, context: object, defaultValue?: any): any 
{
  return cmd ? cmd(context) : defaultValue;
}

export function bool (cmd: Command | undefined, context: object, defaultValue: boolean = false): boolean
{
  return cmd ? !!cmd(context) : defaultValue;
}

export function typed<T> (isValid: (value: any) => value is T, invalidValueDefault: T) 
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

export function typedDynamic<T> (isValid: (value: any) => value is T, invalidValueDefault: () => T) 
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

export const number = typed(isNumber, Number.NaN);

export const numberMaybe = typed<number | undefined>(isNumber, undefined);

export const text = typed(isString, '');

export const textMaybe = typed<string | undefined>(isString, undefined);

export const array  = typedDynamic<any[]>(isArray, () => []);