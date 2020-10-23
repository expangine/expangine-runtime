
import { Operations } from '../Operation';
import { ID } from '../types/ID';
import { Computeds } from '../Computed';


export const MapOperations = new Operations(ID.Map + ID.Delimiter);

export const MapComputeds = new Computeds(ID.Map + ID.Delimiter);

const ops = MapOperations;

export const MapOps = 
{

  // Static

  create: ops.set('create'),

  createLike: ops.set('createLike', {}, ['map'], [], [], [], ['map']),
  
  createFor: ops.set('createFor', {}, ['value'], ['key'],  [], [], ['value', 'key']),

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

  cmp: ops.set('cmp', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test'], ['compare'], [] as never, true),

  copy: ops.set('copy', { complexity: 1 }, ['map'], ['deepCopy', 'deepCopyKey'], ['map', 'key', 'value'], ['deepCopy', 'deepCopyKey'], ['map'], true),

  map: ops.set('map', { complexity: 1 }, ['map'], ['transform', 'transformKey'], ['map', 'key', 'value'], ['transform', 'transformKey'], ['map'], true),

  toPlainObject: ops.set('plain', { complexity: 1 }, ['map'], [] as never, [] as never, [] as never, [] as never, true),

  fromPlainObject: ops.set('fromPlain', { complexity: 1 }, ['object'], [] as never, [] as never, [] as never, ['object'], true),

  // Comparisons

  isValid: ops.set('?', {}, ['value']),

  isEqual: ops.set('=', { complexity: 1 }, ['value', 'test', 'isEqual'], [], ['key', 'value', 'test'], ['isEqual'], [] as never, true),

  isNotEqual: ops.set('!=', { complexity: 1 }, ['value', 'test', 'isEqual'], [], ['key', 'value', 'test'], ['isEqual'], [] as never, true),

  isLess: ops.set('<', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test'], ['compare'], [] as never, true),

  isLessOrEqual: ops.set('<=', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test'], ['compare'], [] as never, true),

  isGreater: ops.set('>', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test'], ['compare'], [] as never, true),

  isGreaterOrEqual: ops.set('>=', { complexity: 1 }, ['value', 'test', 'compare'], [], ['key', 'value', 'test'], ['compare'], [] as never, true),

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

  asSet: ops.set('~' + ID.Set, {}, ['value']),

};

MapComputeds.set('copy', MapOps.copy);
MapComputeds.set('keys', MapOps.keys);
MapComputeds.set('values', MapOps.values);
MapComputeds.set('entries', MapOps.entries);
MapComputeds.set('pairs', MapOps.pairs);
MapComputeds.set('count', MapOps.count);