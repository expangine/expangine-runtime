
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { TextType } from '../types/Text';


const ops = NumberType.operations;


export const NumberOps = 
{

  // Binary Operations

  add: ops.set('+', NumberType, { value: NumberType, addend: NumberType }),

  sub: ops.set('-', NumberType, { value: NumberType, subtrahend: NumberType }),

  mul: ops.set('*', NumberType, { value: NumberType, multiplier: NumberType }),

  div: ops.set('/', NumberType, { value: NumberType, divisor: NumberType }),

  mod: ops.set('%', NumberType, { value: NumberType, divisor: NumberType }),

  min: ops.set('min', NumberType, { a: NumberType, b: NumberType }),

  max: ops.set('max', NumberType, { a: NumberType, b: NumberType }),
  
  pow: ops.set('^^', NumberType, { value: NumberType, exponent: NumberType }),
  
  atan2: ops.set('atan2', NumberType, { x: NumberType, y: NumberType }),
  
  hypot: ops.set('hyp', NumberType, { a: NumberType, b: NumberType }),
  
  choose: ops.set('choose', NumberType, { n: NumberType, k: NumberType }),
  
  gcd: ops.set('gcd', NumberType, { a: NumberType, b: NumberType }),

  bitAnd: ops.set('&', NumberType, { a: NumberType, b: NumberType }),

  bitOr: ops.set('|', NumberType, { a: NumberType, b: NumberType }),

  bitXor: ops.set('^', NumberType, { a: NumberType, b: NumberType }),

  // Unary Operations
  
  sqrt: ops.set('sqrt', NumberType, { value: NumberType }),

  sq: ops.set('^2', NumberType, { value: NumberType }),
  
  cbrt: ops.set('cbrt', NumberType, { value: NumberType }),
  
  floor: ops.set('floor', NumberType, { value: NumberType }),
  
  ceil: ops.set('ceil', NumberType, { value: NumberType }),
  
  up: ops.set('up', NumberType, { value: NumberType }),
  
  down: ops.set('down', NumberType, { value: NumberType }),
  
  round: ops.set('round', NumberType, { value: NumberType }),
  
  abs: ops.set('abs', NumberType, { value: NumberType }),
  
  neg: ops.set('neg', NumberType, { value: NumberType }),
  
  sign: ops.set('sign', NumberType, { value: NumberType }),
  
  log: ops.set('log', NumberType, { value: NumberType }),
  
  sin: ops.set('sin', NumberType, { value: NumberType }),
  
  cos: ops.set('cos', NumberType, { value: NumberType }),
  
  tan: ops.set('tan', NumberType, { value: NumberType }),
  
  sinh: ops.set('sinh', NumberType, { value: NumberType }),
  
  cosh: ops.set('cosh', NumberType, { value: NumberType }),

  asin: ops.set('asin', NumberType, { value: NumberType }),
  
  acos: ops.set('acos', NumberType, { value: NumberType }),
  
  atan: ops.set('atan', NumberType, { value: NumberType }),
  
  factorial: ops.set('!', NumberType, { value: NumberType }),

  bitFlip: ops.set('~', NumberType, { value: NumberType }),

  // Other

  clamp: ops.set('clamp', NumberType, { value: NumberType, min: NumberType, max: NumberType }),

  triangleHeight: ops.set('triangleHeight', NumberType, { base: NumberType, side1: NumberType, side2: NumberType }),

  lerp: ops.set('lerp', NumberType, { delta: NumberType, start: NumberType, end: NumberType }),

  // Generators

  rnd: ops.set('rnd', NumberType, {}, { min: NumberType, max: NumberType, whole: BooleanType, includeMax: BooleanType }),

  // Formatters

  toBaseString: ops.set('toBaseString', TextType, { value: NumberType }, { base: NumberType, minDigits: NumberType }),

  toString: ops.set('toString', TextType, { value: NumberType }, { prefix: TextType, suffix: TextType, minPlaces: NumberType, maxPlaces: NumberType, useExponent: BooleanType, thousandSeparator: TextType }),

  // Comparisons

  isValid: ops.set('?', BooleanType, { a: NumberType }),

  isZero: ops.set('0?', BooleanType, { a: NumberType }, { epsilon: NumberType }),

  isEqual: ops.set('=', BooleanType, { a: NumberType, b: NumberType }, { epsilon: NumberType }),

  isNotEqual: ops.set('!=', BooleanType, { a: NumberType, b: NumberType }, { epsilon: NumberType }),

  isLess: ops.set('<', BooleanType, { value: NumberType, test: NumberType }),

  isLessOrEqual: ops.set('<=', BooleanType, { value: NumberType, test: NumberType }),

  isGreater: ops.set('>', BooleanType, { value: NumberType, test: NumberType }),

  isGreaterOrEqual: ops.set('>=', BooleanType, { value: NumberType, test: NumberType }),

  isBetweenInIn: ops.set('[]', BooleanType, { value: NumberType, min: NumberType, max: NumberType }),

  isBetweenInEx: ops.set('[}', BooleanType, { value: NumberType, min: NumberType, max: NumberType }),

  isBetweenExEx: ops.set('{}', BooleanType, { value: NumberType, min: NumberType, max: NumberType }),

  isBetweenExIn: ops.set('{]', BooleanType, { value: NumberType, min: NumberType, max: NumberType }),

  isWhole: ops.set('w?', BooleanType, { value: NumberType }, { epsilon: NumberType }),

  isDecimal: ops.set('d?', BooleanType, { value: NumberType }, { epsilon: NumberType }),

  isPositive: ops.set('+?', BooleanType, { value: NumberType }),

  isNegative: ops.set('-?', BooleanType, { value: NumberType }),

  isDivisible: ops.set('%?', BooleanType, { value: NumberType, by: NumberType }, { epsilon: NumberType }),

};
