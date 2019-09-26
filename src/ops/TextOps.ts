
import { Operations } from '../Operation';
import { ID } from '../types/ID';


export const TextOperations = new Operations(ID.Text + ':');

const ops = TextOperations;

export const TextOps = 
{

  // Statics

  create: ops.set('create'),

  // Operations

  append: ops.set('+', {}, ['value', 'append']),

  prepend: ops.set('pre', {}, ['value', 'prepend']),

  lower: ops.set('lo', {}, ['value']),

  upper: ops.set('up', {}, ['value']),

  char: ops.set('@', {}, ['value', 'index'], ['outside']),

  replace: ops.set('replace', {}, ['value', 'find', 'replace']),

  repeat: ops.set('repeat', {}, ['value', 'times']),

  split: ops.set('split', {}, ['value', 'by'], ['limit']),

  chars: ops.set('chars', {}, ['value']),

  sub: ops.set('sub', {}, ['value'], ['start', 'end']),

  indexOf: ops.set('i?', {}, ['value', 'search'], ['start']),

  lastIndexOf: ops.set('li?', {}, ['value', 'search'], ['start']),

  trim: ops.set('trim', {}, ['value'], ['start', 'end']),

  startsWith: ops.set('starts', {}, ['value', 'test']),

  endsWith: ops.set('ends', {}, ['value', 'test']),

  soundex: ops.set('soundex', { complexity: 1 }, ['value'], ['max', 'min']),

  distance: ops.set('dist', { complexity: 1 }, ['value', 'test']),

  length: ops.set('len', {}, ['value']),

  compare: ops.set('cmp', {}, ['value', 'test'], ['ignoreCase']),

  // Other

  // Generators

  // Formatters

  toNumber: ops.set('toNumber', {}, ['value'], ['invalidValue']),
  
  // Comparisons

  isValid: ops.set('?', {}, ['value']),

  isEmpty: ops.set('0?', {}, ['value']),

  isNotEmpty: ops.set('n?', {}, ['value']),

  isEqual: ops.set('=', {}, ['a', 'b'], ['ignoreCase']),

  isNotEqual: ops.set('!=', {}, ['a', 'b'], ['ignoreCase']),

  isLess: ops.set('<', {}, ['value', 'test'], ['ignoreCase']),

  isLessOrEqual: ops.set('<=', {}, ['value', 'test'], ['ignoreCase']),

  isGreater: ops.set('>', {}, ['value', 'test'], ['ignoreCase']),

  isGreaterOrEqual: ops.set('>=', {}, ['value', 'test'], ['ignoreCase']),

  isLower: ops.set('lo?', {}, ['value']),

  isUpper: ops.set('up?', {}, ['value']),

  // Casts
  
  asAny: ops.set('~' + ID.Any, {}, ['value']),

  asBoolean: ops.set('~' + ID.Boolean, {}, ['value']),

  asDate: ops.set('~' + ID.Date, {}, ['value']),

  asList: ops.set('~' + ID.List, {}, ['value']),

  asMap: ops.set('~' + ID.Map, {}, ['value']),

  asNumber: ops.set('~' + ID.Number, {}, ['value']),

  asObject: ops.set('~' + ID.Object, {}, ['value']),

  asText: ops.set('~' + ID.Text, {}, ['value']),

  asTuple: ops.set('~' + ID.Tuple, {}, ['value']),

};
