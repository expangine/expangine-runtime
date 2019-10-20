
import { Operations } from '../Operation';
import { ID } from '../types/ID';


export const NumberOperations = new Operations(ID.Number + ':');

const ops = NumberOperations;

export const NumberOps = 
{

  // Static

  create: ops.set('create'),

  pi: ops.set('pi'),

  pi2: ops.set('2pi'),

  piHalf: ops.set('hpi'),

  e: ops.set('e'),

  sqrt2: ops.set('sqrt2'),

  sqrt12: ops.set('sqrt1/2'),

  ln2: ops.set('ln2'),

  ln10: ops.set('ln10'),

  log2e: ops.set('log2e'),

  log10e: ops.set('log10e'),

  // Binary Operations

  add: ops.set('+', {}, ['value', 'addend']),

  sub: ops.set('-', {}, ['value', 'subtrahend']),

  mul: ops.set('*', {}, ['value', 'multiplier']),

  div: ops.set('/', {}, ['value', 'divisor']),

  mod: ops.set('%', {}, ['value', 'divisor']),

  min: ops.set('min', {}, ['a', 'b']),

  max: ops.set('max', {}, ['a', 'b']),
  
  pow: ops.set('^^', {}, ['value', 'exponent']),
  
  atan2: ops.set('atan2', {}, ['x', 'y']),
  
  hypot: ops.set('hyp', {}, ['a', 'b']),
  
  choose: ops.set('choose', { complexity: 1 }, ['n', 'k']),
  
  gcd: ops.set('gcd', { complexity: 1 }, ['a', 'b']),

  bitAnd: ops.set('&', {}, ['a', 'b']),

  bitOr: ops.set('|', {}, ['a', 'b']),

  bitXor: ops.set('^', {}, ['a', 'b']),

  cmp: ops.set('cmp', {}, ['value', 'test']),

  // Unary Operations

  maybe: ops.set('maybe', {}, ['value']),

  sqrt: ops.set('sqrt', {}, ['value']),

  sq: ops.set('^2', {}, ['value']),
  
  cbrt: ops.set('cbrt', {}, ['value']),
  
  floor: ops.set('floor', {}, ['value']),
  
  ceil: ops.set('ceil', {}, ['value']),
  
  up: ops.set('up', {}, ['value']),
  
  down: ops.set('down', {}, ['value']),
  
  round: ops.set('round', {}, ['value']),
  
  abs: ops.set('abs', {}, ['value']),
  
  neg: ops.set('neg', {}, ['value']),
  
  sign: ops.set('sign', {}, ['value']),
  
  log: ops.set('log', {}, ['value']),
  
  sin: ops.set('sin', {}, ['value']),
  
  cos: ops.set('cos', {}, ['value']),
  
  tan: ops.set('tan', {}, ['value']),
  
  sinh: ops.set('sinh', {}, ['value']),
  
  cosh: ops.set('cosh', {}, ['value']),

  asin: ops.set('asin', {}, ['value']),
  
  acos: ops.set('acos', {}, ['value']),
  
  atan: ops.set('atan', {}, ['value']),
  
  factorial: ops.set('!', {}, ['value']),

  bitFlip: ops.set('~', {}, ['value']),

  // Other

  clamp: ops.set('clamp', {}, ['value', 'min', 'max']),

  triangleHeight: ops.set('triangleHeight', {}, ['base', 'side1', 'side2']),

  lerp: ops.set('lerp', {}, ['delta', 'start', 'end']),

  // Generators

  rnd: ops.set('rnd', {}, [], ['min', 'max', 'whole', 'includeMax']),

  // Formatters

  toBaseText: ops.set('toBaseText', {}, ['value'], ['base', 'minDigits']),

  toText: ops.set('toText', {}, ['value'], ['prefix', 'suffix', 'minPlaces', 'maxPlaces', 'useExponent', 'thousandSeparator']),

  // Comparisons

  isValid: ops.set('?', {}, ['value']),

  isZero: ops.set('0?', {}, ['value'], ['epsilon']),

  isEqual: ops.set('=', {}, ['value', 'test'], ['epsilon']),

  isNotEqual: ops.set('!=', {}, ['value', 'test'], ['epsilon']),

  isLess: ops.set('<', {}, ['value', 'test']),

  isLessOrEqual: ops.set('<=', {}, ['value', 'test']),

  isGreater: ops.set('>', {}, ['value', 'test']),

  isGreaterOrEqual: ops.set('>=', {}, ['value', 'test']),

  isBetween: ops.set('><', {}, ['value', 'min', 'max'], ['minInclusive', 'maxInclusive']),

  isWhole: ops.set('w?', {}, ['value'], ['epsilon']),

  isDecimal: ops.set('d?', {}, ['value'], ['epsilon']),

  isPositive: ops.set('+?', {}, ['value']),

  isNegative: ops.set('-?', {}, ['value']),

  isDivisible: ops.set('%?', {}, ['value', 'by'], ['epsilon']),

  // Casts
  
  asAny: ops.set('~' + ID.Any, {}, ['value']),

  asBoolean: ops.set('~' + ID.Boolean, {}, ['value']),

  asColor: ops.set('~' + ID.Color, {}, ['value']),

  asDate: ops.set('~' + ID.Date, {}, ['value']),

  asList: ops.set('~' + ID.List, {}, ['value']),

  asMap: ops.set('~' + ID.Map, {}, ['value']),

  asNumber: ops.set('~' + ID.Number, {}, ['value']),

  asObject: ops.set('~' + ID.Object, {}, ['value']),

  asText: ops.set('~' + ID.Text, {}, ['value']),

  asTuple: ops.set('~' + ID.Tuple, {}, ['value']),

};
