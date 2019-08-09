
import { MapType } from '../types/Map';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { GenericType } from '../types/Generic';
import { AnyType } from '../types/Any';


const ops = MapType.operations;


export const MapOps = 
{

  // Operations

  get: ops.build('get', {}, 
    (map) => [map.options.value, { map, key: map.options.key }]
  ),

  set: ops.build('set', { mutates: ['map'] }, 
    (map) => [map.options.value, { map, key: map.options.key, value: map.options.value }]
  ),

  has: ops.build('has', {}, 
    (map) => [BooleanType, { map, key: map.options.key }]
  ),

  delete: ops.build('delete', { mutates: ['map'] }, 
    (map) => [BooleanType, { map, key: map.options.key }]
  ),

  keys: ops.build('keys', { complexity: 1 }, 
    (map) => [map.getKeysType(), { map }]
  ),

  values: ops.build('values', { complexity: 1 }, 
    (map) => [map.getValuesType(), { map }]
  ),

  entries: ops.build('entries', { complexity: 1 }, 
    (map) => [map.getEntriesType(), { map }]
  ),

  clear: ops.build('clear', { mutates: ['map'] }, 
    (map) => [map, { map }]
  ),

  count: ops.build('count', { }, 
    (map) => [NumberType, { map }]
  ),

  cmp: ops.build('cmp', { complexity: 1 }, 
    (map) => [NumberType, { value: map, test: map, compare: NumberType }, {}, map.getCompareScope()],
    MapType.CompareScopeDefaults
  ),

  copy: ops.build('copy', { complexity: 1 }, 
    (map) => [map, { map }, { deepCopy: map.options.value, deepCopyKey: map.options.key }, map.getIterationScope()],
    MapType.IterationScopeDefaults
  ),

  map: ops.build('map', { complexity: 1 }, 
    (map, generics) => [new MapType({ key: generics.R, value: generics.S }), { map }, { transform: generics.S, transformKey: generics.R }, map.getIterationScope()],
    MapType.IterationScopeDefaults,
    { R: new GenericType('R'), S: new GenericType('S') }
  ),

  toPlainObject: ops.build('plain', { complexity: 1 },
    (map) => [AnyType, { map }]
  ),

  // Comparisons

  isEqual: ops.build('=', { complexity: 1 }, 
    (map) => [BooleanType, { value: map, test: map, isEqual: BooleanType }, { }, map.getCompareScope()],
    MapType.CompareScopeDefaults
  ),

  isNotEqual: ops.build('!=', { complexity: 1 }, 
    (map) => [BooleanType, { value: map, test: map, isEqual: BooleanType }, { }, map.getCompareScope()],
    MapType.CompareScopeDefaults
  ),

  isLess: ops.build('<', { complexity: 1 }, 
    (map) => [BooleanType, { value: map, test: map, compare: NumberType }, { }, map.getCompareScope()],
    MapType.CompareScopeDefaults
  ),

  isLessOrEqual: ops.build('<=', { complexity: 1 }, 
    (map) => [BooleanType, { value: map, test: map, compare: NumberType }, { }, map.getCompareScope()],
    MapType.CompareScopeDefaults
  ),

  isGreater: ops.build('>', { complexity: 1 }, 
    (map) => [BooleanType, { value: map, test: map, compare: NumberType }, { }, map.getCompareScope()],
    MapType.CompareScopeDefaults
  ),

  isGreaterOrEqual: ops.build('>=', { complexity: 1 }, 
    (map) => [BooleanType, { value: map, test: map, compare: NumberType }, { }, map.getCompareScope()],
    MapType.CompareScopeDefaults
  ),

};
