
import { AnyType } from '../../types/Any';
import { NumberType } from '../../types/Number';
import { BooleanType } from '../../types/Boolean';
import { DateType } from '../../types/Date';
import { ListType } from '../../types/List';
import { MapType } from '../../types/Map';
import { ObjectType } from '../../types/Object';
import { TextType } from '../../types/Text';
import { TupleType } from '../../types/Tuple';

import { AnyOps } from '../AnyOps';


const ops = AnyType.operations;

export const AnyOpsTypes = 
{

  // Operations

  cmp: ops.setTypes(AnyOps.cmp, NumberType, { value: AnyType, test: AnyType }),

  copy: ops.setTypes(AnyOps.copy, AnyType, { value: AnyType }),

  // Comparisons

  isEqual: ops.setTypes(AnyOps.isEqual, BooleanType, { value: AnyType, test: AnyType }),

  isNotEqual: ops.setTypes(AnyOps.isNotEqual, BooleanType, { value: AnyType, test: AnyType }),

  isLess: ops.setTypes(AnyOps.isLess, BooleanType, { value: AnyType, test: AnyType }),

  isLessOrEqual: ops.setTypes(AnyOps.isLessOrEqual, BooleanType, { value: AnyType, test: AnyType }),

  isGreater: ops.setTypes(AnyOps.isGreater, BooleanType, { value: AnyType, test: AnyType }),

  isGreaterOrEqual: ops.setTypes(AnyOps.isGreaterOrEqual, BooleanType, { value: AnyType, test: AnyType }),

  // Casts

  asAny: ops.setTypes(AnyOps.asAny, i => i.value || AnyType, { value: AnyType }),

  asBoolean: ops.setTypes(AnyOps.asBoolean, BooleanType, { value: AnyType }),

  asDate: ops.setTypes(AnyOps.asDate, DateType, { value: AnyType }),

  asList: ops.setTypes(AnyOps.asList, i => ListType.forItem(i.value || AnyType), { value: AnyType }),

  asMap: ops.setTypes(AnyOps.asMap, i => MapType.forItem(i.value || AnyType), { value: AnyType }),

  asNumber: ops.setTypes(AnyOps.asNumber, NumberType, { value: AnyType }),

  asObject: ops.setTypes(AnyOps.asObject, ObjectType, { value: AnyType }),

  asText: ops.setTypes(AnyOps.asText, TextType, { value: AnyType }),

  asTuple: ops.setTypes(AnyOps.asTuple, i => TupleType.forItem([i.value || AnyType]), { value: AnyType }),

};