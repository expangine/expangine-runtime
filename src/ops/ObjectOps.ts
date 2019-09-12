
import { ObjectType } from '../types/Object';


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
