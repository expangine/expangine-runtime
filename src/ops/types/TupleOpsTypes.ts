
import { TupleType } from '../../types/Tuple';
import { NumberType } from '../../types/Number';
import { BooleanType } from '../../types/Boolean';
import { AnyType } from '../../types/Any';
import { DateType } from '../../types/Date';
import { MapType } from '../../types/Map';
import { ObjectType } from '../../types/Object';
import { ListType } from '../../types/List';
import { TextType } from '../../types/Text';

import { TupleOps } from '../TupleOps';
import { OptionalType } from '../../types/Optional';
import { ManyType } from '../../types/Many';


const ops = TupleType.operations;


export const TupleOpsTypes = 
{

  // Statics

  create: ops.setTypes(TupleOps.create, TupleType),

  // Operations

  maybe: ops.setTypes(TupleOps.maybe, 
    i => {
      if (i.value instanceof TupleType) {
        return i.value;
      }
      if (i.value instanceof OptionalType && i.value.options instanceof TupleType){
        return i.value;
      }
      if (i.value instanceof ManyType) {
        const oneOf = i.value.options.find(t => t instanceof TupleType);
        if (oneOf) {
          return OptionalType.for(oneOf);
        }
        const oneOfOptional = i.value.options.find(t => t instanceof OptionalType && t.options instanceof TupleType);
        if (oneOfOptional) {
          return oneOfOptional;
        }
      }

      return OptionalType.for(TupleType);
    }, 
    { value: AnyType } 
  ),

  cmp: ops.setTypes(TupleOps.cmp, NumberType, { value: TupleType, test: TupleType }),

  copy: ops.setTypes(TupleOps.copy, TupleType, { value: TupleType }),

  get: ops.setTypes(TupleOps.get, AnyType, { value: TupleType, index: NumberType }),

  set: ops.setTypes(TupleOps.set, AnyType, { value: TupleType, index: NumberType, element: AnyType }),

  // Comparisons

  isValid: ops.setTypes(TupleOps.isValid, BooleanType, { value: TupleType }),

  isEqual: ops.setTypes(TupleOps.isEqual, BooleanType, { value: TupleType, test: TupleType }),

  isNotEqual: ops.setTypes(TupleOps.isNotEqual, BooleanType, { value: TupleType, test: TupleType }),

  isLess: ops.setTypes(TupleOps.isLess, BooleanType, { value: TupleType, test: TupleType }),

  isLessOrEqual: ops.setTypes(TupleOps.isLessOrEqual, BooleanType, { value: TupleType, test: TupleType }),

  isGreater: ops.setTypes(TupleOps.isGreater, BooleanType, { value: TupleType, test: TupleType }),

  isGreaterOrEqual: ops.setTypes(TupleOps.isGreaterOrEqual, BooleanType, { value: TupleType, test: TupleType }),

  // Casts

  asAny: ops.setTypes(TupleOps.asAny, AnyType, { value: TupleType }),

  asBoolean: ops.setTypes(TupleOps.asBoolean, BooleanType, { value: TupleType }),

  asDate: ops.setTypes(TupleOps.asDate, DateType, { value: TupleType }),

  asList: ops.setTypes(TupleOps.asList, i => ListType.forItem(i.value || TupleType), { value: TupleType }),

  asMap: ops.setTypes(TupleOps.asMap, i => MapType.forItem(i.value || TupleType), { value: TupleType }),

  asNumber: ops.setTypes(TupleOps.asNumber, NumberType, { value: TupleType }),

  asObject: ops.setTypes(TupleOps.asObject, ObjectType, { value: TupleType }),

  asText: ops.setTypes(TupleOps.asText, TextType, { value: TupleType }),

  asTuple: ops.setTypes(TupleOps.asTuple, i => i.value || TupleType, { value: TupleType }),

};
