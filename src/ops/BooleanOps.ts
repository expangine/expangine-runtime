
import { AnyType } from '../types/Any';
import { BooleanType } from '../types/Boolean';
import { DateType } from '../types/Date';
import { ListType } from '../types/List';
import { MapType } from '../types/Map';
import { NumberType } from '../types/Number';
import { ObjectType } from '../types/Object';
import { TextType } from '../types/Text';
import { TupleType } from '../types/Tuple';


const ops = BooleanType.operations;


export const BooleanOps = 
{

  // Static

  create: ops.set('create'),

  // Operations

  and: ops.set('&', {}, ['a', 'b']),

  or: ops.set('|', {}, ['a', 'b']),

  xor: ops.set('^', {}, ['a', 'b']),

  not: ops.set('!', {}, ['a']),

  cmp: ops.set('cmp', {}, ['value', 'test']),

  // Comparisons

  isValid: ops.set('?', {}, ['value']),

  isTrue: ops.set('t?', {}, ['value']),

  isFalse: ops.set('f?', {}, ['value']),

  // Casts

  asAny: ops.set('~' + AnyType.id, {}, ['value']),

  asBoolean: ops.set('~' + BooleanType.id, {}, ['value']),

  asDate: ops.set('~' + DateType.id, {}, ['value']),

  asList: ops.set('~' + ListType.id, {}, ['value']),

  asMap: ops.set('~' + MapType.id, {}, ['value']),

  asNumber: ops.set('~' + NumberType.id, {}, ['value']),

  asObject: ops.set('~' + ObjectType.id, {}, ['value']),

  asText: ops.set('~' + TextType.id, {}, ['value']),

  asTuple: ops.set('~' + TupleType.id, {}, ['value']),

};