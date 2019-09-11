
import { AnyType } from '../types/Any';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { DateType } from '../types/Date';
import { ListType } from '../types/List';
import { MapType } from '../types/Map';
import { ObjectType } from '../types/Object';
import { TextType } from '../types/Text';
import { TupleType } from '../types/Tuple';


const ops = AnyType.operations;


const ANY_COMPLEXITY = {
  complexity: 2
};

export const AnyOps = 
{

  // Operations

  cmp: ops.set('cmp', ANY_COMPLEXITY, NumberType, { value: AnyType, test: AnyType }),

  copy: ops.set('copy', ANY_COMPLEXITY, AnyType, { value: AnyType }),

  // Comparisons

  isEqual: ops.set('=', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

  isNotEqual: ops.set('!=', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

  isLess: ops.set('<', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

  isLessOrEqual: ops.set('<=', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

  isGreater: ops.set('>', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

  isGreaterOrEqual: ops.set('>=', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

  // Casts

  asAny: ops.set('~any', {}, AnyType, { value: AnyType }),

  asBoolean: ops.set('~bool', {}, BooleanType, { value: AnyType }),

  asDate: ops.set('~date', {}, DateType, { value: AnyType }),

  asList: ops.set('~list', {}, ListType.forItem(AnyType), { value: AnyType }),

  asMap: ops.set('~map', {}, MapType.forItem(AnyType), { value: AnyType }),

  asNumber: ops.set('~num', {}, NumberType, { value: AnyType }),

  asObject: ops.set('~obj', {}, ObjectType, { value: AnyType }),

  asText: ops.set('~text', {}, TextType, { value: AnyType }),

  asTuple: ops.set('~tuple', {}, TupleType.forItem([AnyType]), { value: AnyType }),

};
