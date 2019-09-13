
import { AnyType } from '../types/Any';
import { BooleanType } from '../types/Boolean';
import { DateType } from '../types/Date';
import { ListType } from '../types/List';
import { MapType } from '../types/Map';
import { NumberType } from '../types/Number';
import { ObjectType } from '../types/Object';
import { TextType } from '../types/Text';
import { TupleType } from '../types/Tuple';


const ops = ObjectType.operations;


export const ObjectOps = 
{

  // Static

  create: ops.set('create'),

  // Operations

  has: ops.set('has', {}, ['object', 'key']),

  get: ops.set('get', {}, ['object', 'key']),

  set: ops.set('set', { mutates: ['object'] }, ['object', 'key', 'value']),

  delete: ops.set('del', { mutates: ['object'] }, ['object', 'key']),

  cmp: ops.set('cmp', {}, ['value', 'test']),

  copy: ops.set('copy', {}, ['object']),

  // Comparisons

  isEqual: ops.set('=', {}, ['value', 'test']),

  isNotEqual: ops.set('!=', {}, ['value', 'test']),

  isLess: ops.set('<', {}, ['value', 'test']),

  isLessOrEqual: ops.set('<=', {}, ['value', 'test']),

  isGreater: ops.set('>', {}, ['value', 'test']),

  isGreaterOrEqual: ops.set('>=', {}, ['value', 'test']),

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
