
import { TextType } from '../types/Text';


const ops = TextType.operations;


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

  isValid: ops.set('?', {}, ['a']),

  isEmpty: ops.set('0?', {}, ['a']),

  isNotEmpty: ops.set('n?', {}, ['a']),

  isEqual: ops.set('=', {}, ['a', 'b'], ['ignoreCase']),

  isNotEqual: ops.set('!=', {}, ['a', 'b'], ['ignoreCase']),

  isLess: ops.set('<', {}, ['value', 'test'], ['ignoreCase']),

  isLessOrEqual: ops.set('<=', {}, ['value', 'test'], ['ignoreCase']),

  isGreater: ops.set('>', {}, ['value', 'test'], ['ignoreCase']),

  isGreaterOrEqual: ops.set('>=', {}, ['value', 'test'], ['ignoreCase']),

  isLower: ops.set('lo?', {}, ['value']),

  isUpper: ops.set('up?', {}, ['value']),

  // Casts
  
  asAny: ops.set('~any', {}, ['value']),

  asBoolean: ops.set('~bool', {}, ['value']),

  asDate: ops.set('~date', {}, ['value']),

  asList: ops.set('~list', {}, ['value']),

  asMap: ops.set('~map', {}, ['value']),

  asNumber: ops.set('~num', {}, ['value']),

  asObject: ops.set('~obj', {}, ['value']),

  asText: ops.set('~text', {}, ['value']),

  asTuple: ops.set('~tuple', {}, ['value']),

};
