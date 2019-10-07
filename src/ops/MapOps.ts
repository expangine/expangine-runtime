
import { Operations } from '../Operation';
import { ID } from '../types/ID';


export const MapOperations = new Operations(ID.Map + ':');

const ops = MapOperations;

export const MapOps = 
{

  // Static

  create: ops.set('create'),

  // Operations

  maybe: ops.set('maybe', {}, ['value']),

  get: ops.set('get', {}, ['map', 'key'], [], [], [], ['map']),

  set: ops.set('set', { mutates: ['map'] }, ['map', 'key', 'value'], [], ['existingValue'], ['value'], ['map']),

  has: ops.set('has', {}, ['map', 'key']),

  delete: ops.set('delete', { mutates: ['map'] }, ['map', 'key']),

  keys: ops.set('keys', { complexity: 1 }, ['map'], [], [], [], ['map']),

  values: ops.set('values', { complexity: 1 }, ['map'], [], [], [], ['map']),

  entries: ops.set('entries', { complexity: 1 }, ['map'], [], [], [], ['map']),

  pairs: ops.set('pairs', { complexity: 1 }, ['map'], [], [], [], ['map']),

  clear: ops.set('clear', { mutates: ['map'] }, ['map'], [], [], [], ['map']),

  count: ops.set('count', { }, ['map']),

  cmp: ops.set('cmp', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test'], ['compare']),

  copy: ops.set('copy', { complexity: 1 }, ['map'], ['deepCopy', 'deepCopyKey'], ['map', 'key', 'value'], ['deepCopy', 'deepCopyKey'], ['map']),

  map: ops.set('map', { complexity: 1 }, ['map'], ['transform', 'transformKey'], ['map', 'key', 'value'], ['transform', 'transformKey'], ['map']),

  toPlainObject: ops.set('plain', { complexity: 1 }, ['map']),

  // Comparisons

  isValid: ops.set('?', {}, ['value']),

  isEqual: ops.set('=', { complexity: 1 }, ['value', 'test', 'isEqual'], [], ['key', 'value', 'test'], ['isEqual']),

  isNotEqual: ops.set('!=', { complexity: 1 }, ['value', 'test', 'isEqual'], [], ['key', 'value', 'test'], ['isEqual']),

  isLess: ops.set('<', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test'], ['compare']),

  isLessOrEqual: ops.set('<=', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test'], ['compare']),

  isGreater: ops.set('>', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test'], ['compare']),

  isGreaterOrEqual: ops.set('>=', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test'], ['compare']),

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
