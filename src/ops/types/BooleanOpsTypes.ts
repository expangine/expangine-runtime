
import { AnyType } from '../../types/Any';
import { NumberType } from '../../types/Number';
import { BooleanType } from '../../types/Boolean';
import { DateType } from '../../types/Date';
import { ListType } from '../../types/List';
import { MapType } from '../../types/Map';
import { ObjectType } from '../../types/Object';
import { TextType } from '../../types/Text';
import { TupleType } from '../../types/Tuple';

import { BooleanOps } from '../BooleanOps';
import { OptionalType } from '../../types/Optional';
import { ManyType } from '../../types/Many';
import { ColorType } from '../../types/Color';


const ops = BooleanType.operations;


export const BooleanOpsTypes = 
{

  // Static

  create: ops.setTypes(BooleanOps.create, BooleanType),

  // Operations

  maybe: ops.setTypes(BooleanOps.maybe, 
    i => {
      if (i.value instanceof BooleanType) {
        return i.value;
      }
      if (i.value instanceof OptionalType && i.value.options instanceof BooleanType){
        return i.value;
      }
      if (i.value instanceof ManyType) {
        const oneOf = i.value.options.find(t => t instanceof BooleanType);
        if (oneOf) {
          return OptionalType.for(oneOf);
        }
        const oneOfOptional = i.value.options.find(t => t instanceof OptionalType && t.options instanceof BooleanType);
        if (oneOfOptional) {
          return oneOfOptional;
        }
      }

      return OptionalType.for(BooleanType);
    }, 
    { value: AnyType } 
  ),

  and: ops.setTypes(BooleanOps.and, BooleanType, { a: BooleanType, b: BooleanType }),

  or: ops.setTypes(BooleanOps.or, BooleanType, { a: BooleanType, b: BooleanType }),

  xor: ops.setTypes(BooleanOps.xor, BooleanType, { a: BooleanType, b: BooleanType }),

  not: ops.setTypes(BooleanOps.not, BooleanType, { a: BooleanType }),

  cmp: ops.setTypes(BooleanOps.cmp, NumberType, { value: BooleanType, test: BooleanType }),

  // Comparisons

  isValid: ops.setTypes(BooleanOps.isValid, BooleanType, { value: BooleanType }),

  isTrue: ops.setTypes(BooleanOps.isTrue, BooleanType, { value: BooleanType }),

  isFalse: ops.setTypes(BooleanOps.isFalse, BooleanType, { value: BooleanType }),

  // Casts

  asAny: ops.setTypes(BooleanOps.asAny, AnyType, { value: BooleanType }),

  asBoolean: ops.setTypes(BooleanOps.asBoolean, i => i.value || BooleanType, { value: BooleanType }),

  asColor: ops.setTypes(BooleanOps.asColor, ColorType, { value: BooleanType }),

  asDate: ops.setTypes(BooleanOps.asDate, DateType, { value: BooleanType }),

  asList: ops.setTypes(BooleanOps.asList, i => ListType.forItem(i.value || BooleanType), { value: BooleanType }),

  asMap: ops.setTypes(BooleanOps.asMap, i => MapType.forItem(i.value || BooleanType), { value: BooleanType }),

  asNumber: ops.setTypes(BooleanOps.asNumber, NumberType, { value: BooleanType }),

  asObject: ops.setTypes(BooleanOps.asObject, ObjectType, { value: BooleanType }),

  asText: ops.setTypes(BooleanOps.asText, TextType, { value: BooleanType }),

  asTuple: ops.setTypes(BooleanOps.asTuple, i => TupleType.forItem([i.value || BooleanType]), { value: BooleanType }),

};