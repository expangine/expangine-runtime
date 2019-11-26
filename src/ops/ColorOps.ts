
import { ID } from '../types/ID';
import { Operations } from '../Operation';
import { Computeds } from '../Computed';


export const ColorOperations = new Operations(ID.Color + ID.Delimiter);

export const ColorComputeds = new Computeds(ID.Color + ID.Delimiter);

const ops = ColorOperations;


export const ColorOps = 
{

  // Static

  create: ops.set('create', {}),

  // Operations

  maybe: ops.set('maybe', {}, ['value']),

  cmp: ops.set('cmp', {}, ['value', 'test']),

  copy: ops.set('copy', {}, ['value']),

  build: ops.set('build', {}, ['r', 'g', 'b'], ['a']),

  map: ops.set('map', {}, ['value', 'r', 'g', 'b'], ['a'], ['value', 'component'], ['r', 'g', 'b', 'a']),

  op: ops.set('op', {}, ['value', 'test', 'r', 'g', 'b'], ['a'], ['value', 'test', 'component'], ['r', 'g', 'b', 'a']),

  clamp: ops.set('clamp', {}, ['value']),

  add: ops.set('+', {}, ['value', 'addend'], ['alpha']),

  adds: ops.set('+*', {}, ['value', 'addend', 'addendScale'], ['alpha']),

  sub: ops.set('-', {}, ['value', 'subtrahend'], ['alpha']),

  mul: ops.set('*', {}, ['value', 'multiplier'], ['alpha']),

  div: ops.set('/', {}, ['value', 'divisor'], ['alpha']),

  mod: ops.set('%', {}, ['value', 'divisor'], ['alpha']),

  format: ops.set('format', {}, ['value', 'format']),

  parse: ops.set('parse', {}, ['value']),

  lerp: ops.set('lerp', {}, ['start', 'end', 'delta']),

  lighten: ops.set('lighten', {}, ['value', 'amount']),

  darken: ops.set('darken', {}, ['value', 'amount']),

  toHSL: ops.set('->hsl', {}, ['value']),

  fromHSL: ops.set('<-hsl', {}, ['value']),

  luminance: ops.set('luminance', {}, ['value']),

  contrast: ops.set('contrast', {}, ['value', 'test']),

  invert: ops.set('invert', {}, ['value'], ['alpha']),

  opaque: ops.set('opaque', {}, ['value']),

  alpha: ops.set('alpha', {}, ['value', 'alpha']),

  distance: ops.set('distance', {}, ['value', 'test']),

  named: ops.set('named', {}, ['name']),

  getName: ops.set('getName', {}, ['value']),

  blend: ops.set('blend', {}, ['top', 'bottom', 'mode']),

  // Comparisons

  isValid: ops.set('?', {}, ['value']),

  isEqual: ops.set('=', {}, ['value', 'test'], ['epsilon']),

  isNotEqual: ops.set('!=', {}, ['value', 'test'], ['epsilon']),

  isLess: ops.set('<', {}, ['value', 'test']),

  isLessOrEqual: ops.set('<=', {}, ['value', 'test']),

  isGreater: ops.set('>', {}, ['value', 'test']),

  isGreaterOrEqual: ops.set('>=', {}, ['value', 'test']),

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

ColorComputeds.set('toHSL', ColorOps.toHSL);
ColorComputeds.set('luminance', ColorOps.luminance);
ColorComputeds.set('inverted', ColorOps.invert);
ColorComputeds.set('opaque', ColorOps.opaque);
ColorComputeds.set('name', ColorOps.getName);