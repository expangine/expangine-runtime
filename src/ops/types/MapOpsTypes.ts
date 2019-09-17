
import { Type } from '../../Type';
import { MapType } from '../../types/Map';
import { NumberType } from '../../types/Number';
import { BooleanType } from '../../types/Boolean';
import { AnyType } from '../../types/Any';
import { TextType } from '../../types/Text';

import { MapOps } from '../MapOps';
import { ListType } from '../../types/List';
import { ObjectType } from '../../types/Object';
import { DateType } from '../../types/Date';
import { TupleType } from '../../types/Tuple';


const ops = MapType.operations;
const GivenMap = (i: {map?: Type}) => i.map || MapType;
const GivenMapValue = (i: {map?: Type}) => i.map ? i.map.options.value : AnyType;
const GivenMapKey = (i: {map?: Type}) => i.map ? i.map.options.key : TextType;
const GivenMapIterationScope = { map: GivenMap, key: GivenMapKey, value: GivenMapValue };

const GivenValueMap = (i: {value?: Type}) => i.value || MapType;
const GivenValueMapValue = (i: {value?: Type}) => i.value ? i.value.options.value : AnyType;
const GivenValueMapKey = (i: {value?: Type}) => i.value ? i.value.options.key : TextType;
const GivenValueCompareScope = { key: GivenValueMapKey, value: GivenValueMapValue, test: GivenValueMapValue };

export const MapOpsTypes = 
{

  // Static

  create: ops.setTypes(MapOps.create, MapType),

  // Operations

  get: ops.setTypes(MapOps.get, 
    GivenMapValue,
    { map: GivenMap, key: GivenMapKey }
  ),

  set: ops.setTypes(MapOps.set, 
    GivenMapValue,
    { map: GivenMap, key: GivenMapKey, value: GivenMapValue },
    {},
    { existingValue: GivenMapValue }
  ),

  has: ops.setTypes(MapOps.has, 
    BooleanType,
    { map: GivenMap, key: GivenMapKey }
  ),

  delete: ops.setTypes(MapOps.delete, 
    BooleanType,
    { map: GivenMap, key: GivenMapKey }
  ),

  keys: ops.setTypes(MapOps.keys, 
    i => ListType.forItem(GivenMapKey(i)),
    { map: GivenMap }
  ),

  values: ops.setTypes(MapOps.values, 
    i => ListType.forItem(GivenMapValue(i)),
    { map: GivenMap }
  ),

  entries: ops.setTypes(MapOps.entries, 
    i => ObjectType.from({
      keys: ListType.forItem(GivenMapKey(i)),
      values: ListType.forItem(GivenMapValue(i)),
    }),
    { map: GivenMap }
  ),

  clear: ops.setTypes(MapOps.clear, 
    GivenMap,
    { map: GivenMap }
  ),

  count: ops.setTypes(MapOps.count, 
    NumberType,
    { map: GivenMap }
  ),

  cmp: ops.setTypes(MapOps.cmp, 
    NumberType,
    { value: GivenValueMap, test: GivenValueMap, compare: NumberType },
    {},
    GivenValueCompareScope
  ),

  copy: ops.setTypes(MapOps.copy, 
    GivenMap,
    { map: GivenMap },
    { deepCopy: GivenMapValue, deepCopyKey: GivenMapKey },
    GivenMapIterationScope
  ),

  map: ops.setTypes(MapOps.map, 
    i => MapType.forItem(i.transform || GivenMapValue(i), i.transformKey || GivenMapKey(i)),
    { map: GivenMap },
    { transform: i => i.transform || GivenMapValue(i), transformKey: i => i.transformKey || GivenMapKey(i) },
    GivenMapIterationScope
  ),

  toPlainObject: ops.setTypes(MapOps.toPlainObject,
    AnyType,
    { map: GivenMap }
  ),

  // Comparisons

  isValid: ops.setTypes(MapOps.isValid, 
    BooleanType, 
    { value: GivenValueMap }
  ),

  isEqual: ops.setTypes(MapOps.isEqual, 
    BooleanType,
    { value: GivenValueMap, test: GivenValueMap, isEqual: BooleanType }, 
    {},
    GivenValueCompareScope
  ),

  isNotEqual: ops.setTypes(MapOps.isNotEqual, 
    BooleanType,
    { value: GivenValueMap, test: GivenValueMap, isEqual: BooleanType }, 
    {},
    GivenValueCompareScope
  ),

  isLess: ops.setTypes(MapOps.isLess, 
    BooleanType,
    { value: GivenValueMap, test: GivenValueMap, compare: NumberType }, 
    {},
    GivenValueCompareScope
  ),

  isLessOrEqual: ops.setTypes(MapOps.isLessOrEqual, 
    BooleanType,
    { value: GivenValueMap, test: GivenValueMap, compare: NumberType }, 
    {},
    GivenValueCompareScope
  ),

  isGreater: ops.setTypes(MapOps.isGreater, 
    BooleanType,
    { value: GivenValueMap, test: GivenValueMap, compare: NumberType }, 
    {},
    GivenValueCompareScope
  ),

  isGreaterOrEqual: ops.setTypes(MapOps.isGreaterOrEqual, 
    BooleanType,
    { value: GivenValueMap, test: GivenValueMap, compare: NumberType }, 
    {},
    GivenValueCompareScope
  ),

  // Casts

  asAny: ops.setTypes(MapOps.asAny, AnyType, { value: MapType }),

  asBoolean: ops.setTypes(MapOps.asBoolean, BooleanType, { value: MapType }),

  asDate: ops.setTypes(MapOps.asDate, DateType, { value: MapType }),

  asList: ops.setTypes(MapOps.asList, i => ListType.forItem(GivenValueMapValue(i)), { value: MapType }),

  asMap: ops.setTypes(MapOps.asMap, i => i.value || MapType, { value: MapType }),

  asNumber: ops.setTypes(MapOps.asNumber, i => NumberType, { value: MapType }),

  asObject: ops.setTypes(MapOps.asObject, ObjectType, { value: MapType }),

  asText: ops.setTypes(MapOps.asText, TextType, { value: MapType }),

  asTuple: ops.setTypes(MapOps.asTuple, i => TupleType.forItem([i.value || MapType]), { value: MapType }),

};
