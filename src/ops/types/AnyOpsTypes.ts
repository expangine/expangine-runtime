
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
import { ManyType } from '../../types/Many';
import { NullType } from '../../types/Null';
import { Type } from '../../Type';


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
    i => {
      let optional = true;
      const types: Type[] = [];
      const checkType = (x?: Type) => {
        if (!optional) return;
        
        if (x) {
          let xoptional = x instanceof OptionalType;
          const xinner = xoptional ? x.options as Type : x;

          if (xinner instanceof ManyType) {
            xinner.options.forEach((y) => {
              const yoptional = y instanceof OptionalType;
              const yinner = yoptional ? y.options as Type : y;

              xoptional = xoptional || yoptional;

              if (!types.some(t => t.exactType(yinner))) {
                types.push(yinner);
              }
            });
          }

          optional = optional && xoptional;

          if (!types.some(t => t.exactType(xinner))) {
            types.push(xinner);
          }
        }
      };

      checkType(i.a);
      checkType(i.b);
      checkType(i.c);
      checkType(i.d);
      checkType(i.e);

      return types.length > 1
        ? optional
          ? OptionalType.for(new ManyType(types))
          : new ManyType(types)
        : types.length === 1
          ? optional
            ? OptionalType.for(types[0])
            : types[0]
          : NullType;
    },
    { a: AnyType, b: AnyType },
    { c: AnyType, d: AnyType, e: AnyType }
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

  asDate: ops.setTypes(AnyOps.asDate, DateType, { value: AnyType }),

  asList: ops.setTypes(AnyOps.asList, i => ListType.forItem(i.value || AnyType), { value: AnyType }),

  asMap: ops.setTypes(AnyOps.asMap, i => MapType.forItem(i.value || AnyType), { value: AnyType }),

  asNumber: ops.setTypes(AnyOps.asNumber, NumberType, { value: AnyType }),

  asObject: ops.setTypes(AnyOps.asObject, ObjectType, { value: AnyType }),

  asText: ops.setTypes(AnyOps.asText, TextType, { value: AnyType }),

  asTuple: ops.setTypes(AnyOps.asTuple, i => TupleType.forItem([i.value || AnyType]), { value: AnyType }),

};
