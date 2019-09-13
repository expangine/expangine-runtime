
import { Type } from '../../Type';
import { ObjectType } from '../../types/Object';
import { NumberType } from '../../types/Number';
import { BooleanType } from '../../types/Boolean';
import { TextType } from '../../types/Text';
import { AnyType } from '../../types/Any';

import { ObjectOps } from '../ObjectOps';
import { DateType } from '../../types/Date';
import { ListType } from '../../types/List';
import { MapType } from '../../types/Map';
import { TupleType } from '../../types/Tuple';


const ops = ObjectType.operations;
const GivenObject = (i: {object?: Type}) => i.object || ObjectType;

export const ObjectOpsTypes = 
{

  // Static

  create: ops.setTypes(ObjectOps.create, 
    GivenObject
  ),

  // Operations

  has: ops.setTypes(ObjectOps.has, 
    BooleanType,
    { object: GivenObject, key: TextType }
  ),

  get: ops.setTypes(ObjectOps.get, 
    AnyType,
    { object: GivenObject, key: TextType }
  ),

  set: ops.setTypes(ObjectOps.set, 
    GivenObject,
    { object: GivenObject, key: TextType, value: AnyType },
    {},
    { existingValue: AnyType }
  ),

  delete: ops.setTypes(ObjectOps.delete, 
    AnyType,
    { object: GivenObject, key: TextType }
  ),

  cmp: ops.setTypes(ObjectOps.cmp, 
    NumberType,
    { value: ObjectType, test: ObjectType }
  ),

  copy: ops.setTypes(ObjectOps.copy, 
    GivenObject,
    { object: GivenObject }
  ),

  // Comparisons

  isEqual: ops.setTypes(ObjectOps.isEqual, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  isNotEqual: ops.setTypes(ObjectOps.isNotEqual, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  isLess: ops.setTypes(ObjectOps.isLess, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  isLessOrEqual: ops.setTypes(ObjectOps.isLessOrEqual, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  isGreater: ops.setTypes(ObjectOps.isGreater, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  isGreaterOrEqual: ops.setTypes(ObjectOps.isGreaterOrEqual, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  // Casts

  asAny: ops.setTypes(ObjectOps.asAny, AnyType, { value: ObjectType }),

  asBoolean: ops.setTypes(ObjectOps.asBoolean, BooleanType, { value: ObjectType }),

  asDate: ops.setTypes(ObjectOps.asDate, DateType, { value: ObjectType }),

  asList: ops.setTypes(ObjectOps.asList, i => ListType.forItem(i.value || ObjectType), { value: ObjectType }),

  asMap: ops.setTypes(ObjectOps.asMap, i => MapType.forItem(i.value || ObjectType), { value: ObjectType }),

  asNumber: ops.setTypes(ObjectOps.asNumber, NumberType, { value: ObjectType }),

  asObject: ops.setTypes(ObjectOps.asObject, i => i.value || ObjectType, { value: ObjectType }),

  asText: ops.setTypes(ObjectOps.asText, TextType, { value: ObjectType }),

  asTuple: ops.setTypes(ObjectOps.asTuple, i => TupleType.forItem([i.value || ObjectType]), { value: ObjectType }),

};
