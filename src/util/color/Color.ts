
import { isObject, isNumber, clamp } from '../../fns';


export const COMPONENT_MIN = 0;
export const COMPONENT_MAX = 255;

export interface Color
{
  r: number;
  g: number;
  b: number;
  a: number;
}

export function isColor(x: any): x is Color
{
  return isObject(x) && isNumber(x.r) && isNumber(x.g) && isNumber(x.b);
}

export function clampComponent(x: number): number
{
  return clamp(x, COMPONENT_MIN, COMPONENT_MAX);
}