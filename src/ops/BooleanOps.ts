
import { BooleanType } from '../types/Boolean';


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

  asAny: ops.set('~any', {}, ['value']),

  asBoolean: ops.set('~bool', {}, ['value']),

  asDate: ops.set('~date', {}, ['value']),

  asList: ops.set('~list', {}, ['value']),

  asMap: ops.set('~map', {}, ['value']),

  asNumber: ops.set('~num', {}, ['value']),

  asObject: ops.set('~obj', {}, ['value']),

  asText: ops.set('~text', {}, ['value']),

  asTuple: ops.set('~tuple', {}, ['value']),

};