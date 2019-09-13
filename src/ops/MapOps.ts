
import { AnyType } from '../types/Any';
import { BooleanType } from '../types/Boolean';
import { DateType } from '../types/Date';
import { ListType } from '../types/List';
import { MapType } from '../types/Map';
import { NumberType } from '../types/Number';
import { ObjectType } from '../types/Object';
import { TextType } from '../types/Text';
import { TupleType } from '../types/Tuple';


const ops = MapType.operations;


export const MapOps = 
{

  // Static

  create: ops.set('create'),

  // Operations

  get: ops.set('get', {}, ['map', 'key']),

  set: ops.set('set', { mutates: ['map'] }, ['map', 'key', 'value']),

  has: ops.set('has', {}, ['map', 'key']),

  delete: ops.set('delete', { mutates: ['map'] }, ['map', 'key']),

  keys: ops.set('keys', { complexity: 1 }, ['map']),

  values: ops.set('values', { complexity: 1 }, ['map']),

  entries: ops.set('entries', { complexity: 1 }, ['map']),

  clear: ops.set('clear', { mutates: ['map'] }, ['map']),

  count: ops.set('count', { }, ['map']),

  cmp: ops.set('cmp', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test']),

  copy: ops.set('copy', { complexity: 1 }, ['map'], ['deepCopy', 'deepCopyKey'], ['map', 'key', 'value']),

  map: ops.set('map', { complexity: 1 }, ['map'], ['transform', 'transformKey'], ['map', 'key', 'value']),

  toPlainObject: ops.set('plain', { complexity: 1 }, ['map']),

  // Comparisons

  isEqual: ops.set('=', { complexity: 1 }, ['value', 'test', 'isEqual'], [], ['key', 'value', 'test']),

  isNotEqual: ops.set('!=', { complexity: 1 }, ['value', 'test', 'isEqual'], [], ['key', 'value', 'test']),

  isLess: ops.set('<', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test']),

  isLessOrEqual: ops.set('<=', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test']),

  isGreater: ops.set('>', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test']),

  isGreaterOrEqual: ops.set('>=', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test']),

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
