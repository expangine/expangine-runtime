
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
import { OptionalType } from '../../types/Optional';
import { ColorType } from '../../types/Color';
import { SetType } from '../../types/Set';
import { Types } from '../../Types';


const ops = AnyType.operations;

export const AnyOpsTypes = 
{

  // Operations

  cmp: ops.setTypes(AnyOps.cmp, NumberType, { value: AnyType, test: AnyType }),

  copy: ops.setTypes(AnyOps.copy, AnyType, { value: AnyType }),

  isDefined: ops.setTypes(AnyOps.isDefined, 
    BooleanType,
    { value: AnyType }
  ),

  getDefined: ops.setTypes(AnyOps.getDefined, 
    BooleanType,
    { value: AnyType, defined: AnyType },
    {},
    { defined: i => i.value instanceof OptionalType ? i.value.options : i.value }
  ),

  coalesce: ops.setTypes(AnyOps.coalesce, 
    i => Types.coalesce([i.a, i.b, i.c, i.d, i.e]),
    { a: AnyType, b: AnyType },
    { c: AnyType, d: AnyType, e: AnyType }
  ),

  require: ops.setTypes(AnyOps.require, 
    i => i.value instanceof OptionalType
      ? i.value.options
      : i.value || AnyType,
    { value: i => i.value || AnyType },
  ),

  ternary: ops.setTypes(AnyOps.ternary, 
    (i) => {
      if (i.truthy && i.falsy) {
        return Types.mergeMany([i.truthy, i.falsy]);
      } else if (i.truthy) {
        return i.truthy;
      } else if (i.falsy) {
        return i.falsy;
      } else {
        return AnyType;
      }
    },
    { condition: BooleanType, truthy: i => i.truthy || AnyType, falsy: i => i.falsy || AnyType },
  ),

  // Comparisons

  isValid: ops.setTypes(AnyOps.isValid, BooleanType, { value: AnyType }),

  isEqual: ops.setTypes(AnyOps.isEqual, BooleanType, { value: AnyType, test: AnyType }),

  isNotEqual: ops.setTypes(AnyOps.isNotEqual, BooleanType, { value: AnyType, test: AnyType }),

  isLess: ops.setTypes(AnyOps.isLess, BooleanType, { value: AnyType, test: AnyType }),

  isLessOrEqual: ops.setTypes(AnyOps.isLessOrEqual, BooleanType, { value: AnyType, test: AnyType }),

  isGreater: ops.setTypes(AnyOps.isGreater, BooleanType, { value: AnyType, test: AnyType }),

  isGreaterOrEqual: ops.setTypes(AnyOps.isGreaterOrEqual, BooleanType, { value: AnyType, test: AnyType }),

  // Casts

  asAny: ops.setTypes(AnyOps.asAny, i => i.value || AnyType, { value: AnyType }),

  asBoolean: ops.setTypes(AnyOps.asBoolean, BooleanType, { value: AnyType }),

  asColor: ops.setTypes(AnyOps.asColor, ColorType, { value: AnyType }),

  asDate: ops.setTypes(AnyOps.asDate, DateType, { value: AnyType }),

  asList: ops.setTypes(AnyOps.asList, i => ListType.forItem(i.value || AnyType), { value: AnyType }),

  asMap: ops.setTypes(AnyOps.asMap, i => MapType.forItem(i.value || AnyType), { value: AnyType }),

  asNumber: ops.setTypes(AnyOps.asNumber, NumberType, { value: AnyType }),

  asObject: ops.setTypes(AnyOps.asObject, ObjectType, { value: AnyType }),

  asText: ops.setTypes(AnyOps.asText, TextType, { value: AnyType }),

  asTuple: ops.setTypes(AnyOps.asTuple, i => TupleType.forItem([i.value || AnyType]), { value: AnyType }),

  asSet: ops.setTypes(AnyOps.asSet, i => SetType.forItem(i.value || AnyType), { value: AnyType }),

};
