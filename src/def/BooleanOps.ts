
import { AnyType } from '../types/Any';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { DateType } from '../types/Date';
import { ListType } from '../types/List';
import { MapType } from '../types/Map';
import { ObjectType } from '../types/Object';
import { TextType } from '../types/Text';
import { TupleType } from '../types/Tuple';


const ops = BooleanType.operations;


export const BooleanOps = 
{

  // Static

  create: ops.set('create', {}, BooleanType),

  // Operations

  and: ops.set('&', {}, BooleanType, { a: BooleanType, b: BooleanType }),

  or: ops.set('|', {}, BooleanType, { a: BooleanType, b: BooleanType }),

  xor: ops.set('^', {}, BooleanType, { a: BooleanType, b: BooleanType }),

  not: ops.set('!', {}, BooleanType, { a: BooleanType }),

  cmp: ops.set('cmp', {}, NumberType, { value: BooleanType, test: BooleanType }),

  // Comparisons

  isValid: ops.set('?', {}, BooleanType, { value: BooleanType }),

  isTrue: ops.set('t?', {}, BooleanType, { value: BooleanType }),

  isFalse: ops.set('f?', {}, BooleanType, { value: BooleanType }),

  // Casts

  asAny: ops.set('~any', {}, AnyType, { value: BooleanType }),

  asBoolean: ops.set('~bool', {}, BooleanType, { value: BooleanType }),

  asDate: ops.set('~date', {}, DateType, { value: BooleanType }),

  asList: ops.set('~list', {}, ListType.forItem(BooleanType), { value: BooleanType }),

  asMap: ops.set('~map', {}, MapType.forItem(BooleanType), { value: BooleanType }),

  asNumber: ops.set('~num', {}, NumberType, { value: BooleanType }),

  asObject: ops.set('~obj', {}, ObjectType, { value: BooleanType }),

  asText: ops.set('~text', {}, TextType, { value: BooleanType }),

  asTuple: ops.set('~tuple', {}, TupleType.forItem([BooleanType]), { value: BooleanType }),

};