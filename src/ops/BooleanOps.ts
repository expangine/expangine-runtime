
import { Operations } from '../Operation';
import { ID } from '../types/ID';


export const BooleanOperations = new Operations(ID.Boolean + ':');

const ops = BooleanOperations;

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

  asAny: ops.set('~' + ID.Any, {}, ['value']),

  asBoolean: ops.set('~' + ID.Boolean, {}, ['value']),

  asDate: ops.set('~' + ID.Date, {}, ['value']),

  asList: ops.set('~' + ID.List, {}, ['value']),

  asMap: ops.set('~' + ID.Map, {}, ['value']),

  asNumber: ops.set('~' + ID.Number, {}, ['value']),

  asObject: ops.set('~' + ID.Object, {}, ['value']),

  asText: ops.set('~' + ID.Text, {}, ['value']),

  asTuple: ops.set('~' + ID.Tuple, {}, ['value']),

};