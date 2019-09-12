
import { TupleType } from '../types/Tuple';


const ops = TupleType.operations;


export const TupleOps = 
{

  // Statics

  create: ops.set('create'),

  // Operations

  cmp: ops.set('cmp', {}, ['value', 'test']),

  copy: ops.set('copy', {}, ['value']),

  get: ops.set('get', {}, ['value', 'index']),

  set: ops.set('set', { mutates: ['value'] }, ['value', 'index', 'element']),

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
