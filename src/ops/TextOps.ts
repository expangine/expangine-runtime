
import { AnyType } from '../types/Any';
import { BooleanType } from '../types/Boolean';
import { DateType } from '../types/Date';
import { ListType } from '../types/List';
import { MapType } from '../types/Map';
import { NumberType } from '../types/Number';
import { ObjectType } from '../types/Object';
import { TextType } from '../types/Text';
import { TupleType } from '../types/Tuple';


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
  
  asAny: ops.set('~' + AnyType.id, {}, ['value']),

  asBoolean: ops.set('~' + BooleanType.id, {}, ['value']),

  asDate: ops.set('~' + DateType.id, {}, ['value']),

  asList: ops.set('~' + ListType.id, {}, ['value']),

  asMap: ops.set('~' + MapType.id, {}, ['value']),

  asNumber: ops.set('~' + NumberType.id, {}, ['value']),

  asObject: ops.set('~' + ObjectType.id, {}, ['value']),

  asText: ops.set('~' + TextType.id, {}, ['value']),

  asTuple: ops.set('~' + TupleType.id, {}, ['value']),

};
