
import { AnyType } from '../types/Any';


const ops = AnyType.operations;


const ANY_COMPLEXITY = {
  complexity: 2
};

export const AnyOps = 
{

  // Operations

  cmp: ops.set('cmp', ANY_COMPLEXITY, ['value', 'test']),

  copy: ops.set('copy', ANY_COMPLEXITY, ['value']),

  // Comparisons

  isEqual: ops.set('=', ANY_COMPLEXITY, ['value', 'test']),

  isNotEqual: ops.set('!=', ANY_COMPLEXITY, ['value', 'test']),

  isLess: ops.set('<', ANY_COMPLEXITY, ['value', 'test']),

  isLessOrEqual: ops.set('<=', ANY_COMPLEXITY, ['value', 'test']),

  isGreater: ops.set('>', ANY_COMPLEXITY, ['value', 'test']),

  isGreaterOrEqual: ops.set('>=', ANY_COMPLEXITY, ['value', 'test']),

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
