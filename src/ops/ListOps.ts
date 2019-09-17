
import { AnyType } from '../types/Any';
import { BooleanType } from '../types/Boolean';
import { DateType } from '../types/Date';
import { ListType } from '../types/List';
import { MapType } from '../types/Map';
import { NumberType } from '../types/Number';
import { ObjectType } from '../types/Object';
import { TextType } from '../types/Text';
import { TupleType } from '../types/Tuple';


const ops = ListType.operations;

export const ListOps = 
{

  // Static

  create: ops.set('create'),

  // Operations

  build: ops.set('new', {}, ['count', 'item'], ['sameItem'], ['list', 'index', 'last', 'count']),

  get: ops.set('get', {}, ['list', 'index']),

  set: ops.set('set', {}, ['list', 'index', 'value']),

  add: ops.set('+', { mutates: ['list'] }, ['list', 'item']),

  addFirst: ops.set('+f', { mutates: ['list'] }, ['list', 'item']),

  addLast: ops.set('+l', { mutates: ['list'] }, ['list', 'item']),

  insert: ops.set('+@', { mutates: ['list'] }, ['list', 'item', 'index']),

  remove: ops.set('-', { mutates: ['list'], complexity: 1 },  ['list', 'item', 'isEqual'], [], ['list', 'value', 'test']),

  removeFirst: ops.set('-f', { mutates: ['list'] }, ['list']),

  removeLast: ops.set('-l', { mutates: ['list'] }, ['list']),

  removeAt: ops.set('-@', { mutates: ['list'] }, ['list', 'index']),

  contains: ops.set('contains', { complexity: 1 }, ['list', 'item', 'isEqual'], [], ['list', 'value', 'test']),

  copy: ops.set('copy', { complexity: 1 }, ['list'], ['deepCopy'], ['copy']),

  reverse: ops.set('reverse', { complexity: 0.5 }, ['list']),

  exclude: ops.set('exclude', { mutates: ['list'], complexity: 2 },  ['list', 'exclude', 'isEqual'], [], ['list', 'value', 'test']),

  overlap: ops.set('overlap', { complexity: 2 }, ['list', 'overlap', 'isEqual'], [], ['list', 'value', 'test']),

  sort: ops.set('sort', { mutates: ['list'], complexity: 1 },   ['list', 'compare'], [], ['list', 'value', 'test']),

  shuffle: ops.set('shuffle', { mutates: ['list'], complexity: 1 }, ['list'], ['times']),

  unique: ops.set('unique', { complexity: 2 }, ['list', 'isEqual'], [], ['list', 'value', 'test']),

  duplicates: ops.set('dupes', { complexity: 2 }, ['list', 'isEqual'], ['once'], ['list', 'value', 'test']),

  take: ops.set('take', { mutates: ['list'] }, ['list', 'count']),

  skip: ops.set('skip', { mutates: ['list'] }, ['list', 'count']),

  drop: ops.set('drop', { mutates: ['list'] }, ['list', 'count']),

  append: ops.set('append', {}, ['list', 'append']),

  prepend: ops.set('prepend', {}, ['list', 'prepend']),

  indexOf: ops.set('indexOf', { complexity: 1 }, ['list', 'item', 'isEqual'], ['start'], ['list', 'value', 'test']),

  lastIndexOf: ops.set('lastIndexOf', { complexity: 1 }, ['list', 'item', 'isEqual'], ['start'], ['list', 'value', 'test']),

  last: ops.set('last', {}, ['list']),

  first: ops.set('first', {}, ['list']),

  count: ops.set('count', {}, ['list']),

  randomList: ops.set('randomList', {}, ['list', 'count']),

  random: ops.set('random', {}, ['list']),

  // Iteration

  join: ops.set('join', { complexity: 1 }, ['list'], ['delimiter', 'toText', 'prefix', 'suffix'], ['list', 'item', 'index']),

  each: ops.set('each', { complexity: 1 }, ['list', 'each'], ['reverse'], ['list', 'item', 'index']),

  filter: ops.set('filter', { complexity: 1 }, ['list', 'filter'], [], ['list', 'item', 'index']),

  not: ops.set('not', { complexity: 1 }, ['list', 'not'], [], ['list', 'item', 'index']),

  map: ops.set('map', { complexity: 1}, ['list', 'transform'], [], ['list', 'item', 'index']),

  split: ops.set('split', { complexity: 1}, ['list', 'pass'], [], ['list', 'item', 'index']),

  reduce: ops.set('reduce', { complexity: 1}, ['list', 'reduce', 'initial'], [], ['list', 'item', 'index', 'reduced']),

  cmp: ops.set('cmp', { complexity: 1 }, ['value', 'test', 'compare'], [], ['list', 'value', 'test']),

  group: ops.set('group', { complexity: 1 }, ['list', 'getKey'], ['getValue'], ['list', 'item', 'index']),

  toMap: ops.set('toMap', { complexity: 1 }, ['list', 'getKey'], ['getValue'], ['list', 'item', 'index']),

  // Comparisons

  isValid: ops.set('?', {}, ['value']),

  isEmpty: ops.set('0?', {}, ['list']),

  isNotEmpty: ops.set('!0', {}, ['list']),

  isEqual: ops.set('=', { complexity: 1 }, ['list', 'test', 'isEqual'], [], ['list', 'value', 'test']),

  isNotEqual: ops.set('!=', { complexity: 1 }, ['list', 'test', 'isEqual'], [], ['list', 'value', 'test']),

  isLess: ops.set('<', { complexity: 1 }, ['value', 'test', 'compare'], [], ['list', 'value', 'test']),

  isLessOrEqual: ops.set('<=', { complexity: 1 }, ['value', 'test', 'compare'], [], ['list', 'value', 'test']),

  isGreater: ops.set('>', { complexity: 1 }, ['value', 'test', 'compare'], [], ['list', 'value', 'test']),

  isGreaterOrEqual: ops.set('>=', { complexity: 1 }, ['value', 'test', 'compare'], [], ['list', 'value', 'test']),

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
