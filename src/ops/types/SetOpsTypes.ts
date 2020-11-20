
import { Type } from '../../Type';
import { SetType } from '../../types/Set';
import { NumberType } from '../../types/Number';
import { BooleanType } from '../../types/Boolean';
import { AnyType } from '../../types/Any';
import { TextType } from '../../types/Text';

import { SetOps } from '../SetOps';
import { ListType } from '../../types/List';
import { ObjectType } from '../../types/Object';
import { DateType } from '../../types/Date';
import { TupleType } from '../../types/Tuple';
import { ColorType } from '../../types/Color';
import { MapType } from '../../types/Map';
import { Types } from '../../Types';


const ops = SetType.operations;

const RequireSet = (set?: Type) => set instanceof SetType ? set : undefined;
const GivenSet = (i: {set?: Type}) => RequireSet(i.set) || SetType;
const GivenSetValue = (i: {set?: Type}) => RequireSet(i.set) ? i.set?.options.value : AnyType;
const GivenSetIterationScope = { set: GivenSet, value: GivenSetValue };

const GivenValueSet = (i: {value?: Type}) => RequireSet(i.value) || SetType;
const GivenValueSetValue = (i: {value?: Type}) => RequireSet(i.value) ? i.value?.options.value : AnyType;

export const SetOpsTypes = 
{

  // Static

  create: ops.setTypes(SetOps.create, SetType),

  createLike: ops.setTypes(SetOps.createLike, 
    GivenSet,
    { set: GivenSet },
  ),

  createFor: ops.setTypes(SetOps.createFor, 
    i => ListType.forItem(i.value || AnyType),
    { value: i => i.value || AnyType }
  ),

  // Operations

  maybe: ops.setTypes(SetOps.maybe, 
    (i) => Types.maybe(i.value, SetType),
    { value: AnyType } 
  ),

  add: ops.setTypes(SetOps.add, 
    GivenSet,
    { set: GivenSet, value: GivenSetValue },
  ),

  has: ops.setTypes(SetOps.has, 
    BooleanType,
    { set: GivenSet, value: GivenSetValue }
  ),

  delete: ops.setTypes(SetOps.delete, 
    BooleanType,
    { set: GivenSet, value: GivenSetValue }
  ),

  values: ops.setTypes(SetOps.values, 
    i => ListType.forItem(GivenSetValue(i)),
    { set: GivenSet }
  ),

  clear: ops.setTypes(SetOps.clear, 
    GivenSet,
    { set: GivenSet }
  ),

  count: ops.setTypes(SetOps.count, 
    NumberType,
    { set: GivenSet }
  ),

  cmp: ops.setTypes(SetOps.cmp, 
    NumberType,
    { value: GivenValueSet, test: GivenValueSet },
  ),

  copy: ops.setTypes(SetOps.copy, 
    GivenSet,
    { set: GivenSet },
    { deepCopy: GivenSetValue },
    GivenSetIterationScope
  ),

  map: ops.setTypes(SetOps.map, 
    i => SetType.forItem(i.transform || GivenSetValue(i)),
    { set: GivenSet },
    { transform: i => i.transform || GivenSetValue(i) },
    GivenSetIterationScope
  ),

  // Comparisons

  isValid: ops.setTypes(SetOps.isValid, 
    BooleanType, 
    { value: AnyType }
  ),

  isEqual: ops.setTypes(SetOps.isEqual, 
    BooleanType,
    { value: GivenValueSet, test: GivenValueSet }, 
  ),

  isNotEqual: ops.setTypes(SetOps.isNotEqual, 
    BooleanType,
    { value: GivenValueSet, test: GivenValueSet }, 
  ),

  isLess: ops.setTypes(SetOps.isLess, 
    BooleanType,
    { value: GivenValueSet, test: GivenValueSet },
  ),

  isLessOrEqual: ops.setTypes(SetOps.isLessOrEqual, 
    BooleanType,
    { value: GivenValueSet, test: GivenValueSet },
  ),

  isGreater: ops.setTypes(SetOps.isGreater, 
    BooleanType,
    { value: GivenValueSet, test: GivenValueSet },
  ),

  isGreaterOrEqual: ops.setTypes(SetOps.isGreaterOrEqual, 
    BooleanType,
    { value: GivenValueSet, test: GivenValueSet },
  ),

  // Casts

  asAny: ops.setTypes(SetOps.asAny, AnyType, { value: SetType }),

  asBoolean: ops.setTypes(SetOps.asBoolean, BooleanType, { value: SetType }),

  asColor: ops.setTypes(SetOps.asColor, ColorType, { value: SetType }),

  asDate: ops.setTypes(SetOps.asDate, DateType, { value: SetType }),

  asList: ops.setTypes(SetOps.asList, i => ListType.forItem(GivenValueSetValue(i)), { value: SetType }),

  asMap: ops.setTypes(SetOps.asMap, i => MapType.forItem(GivenValueSetValue(i), GivenValueSetValue(i)), { value: SetType }),

  asNumber: ops.setTypes(SetOps.asNumber, i => NumberType, { value: SetType }),

  asObject: ops.setTypes(SetOps.asObject, ObjectType, { value: SetType }),

  asText: ops.setTypes(SetOps.asText, TextType, { value: SetType }),

  asTuple: ops.setTypes(SetOps.asTuple, i => TupleType.forItem([i.value || SetType]), { value: SetType }),

  asSet: ops.setTypes(SetOps.asSet, i => i.value || SetType, { value: SetType }),

};
