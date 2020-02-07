
import { ID } from '../types/ID';
import { Operations } from '../Operation';
import { Computeds } from '../Computed';


export const AnyOperations = new Operations(ID.Any + ID.Delimiter);

export const AnyComputeds = new Computeds(ID.Any + ID.Delimiter);

const ops = AnyOperations;
const ANY_COMPLEXITY = {
  complexity: 2
};

export const AnyOps = 
{

  // Operations

  cmp: ops.set('cmp', ANY_COMPLEXITY, ['value', 'test']),

  copy: ops.set('copy', ANY_COMPLEXITY, ['value']),

  isDefined: ops.set('isDefined', {}, ['value']),

  getDefined: ops.set('getDefined', {}, ['value', 'defined'], [], ['defined'], ['defined'], ['value']),

  coalesce: ops.set('coalesce', {}, ['a', 'b'], ['c', 'd', 'e'], [], [], ['a', 'b', 'c', 'd', 'e']),

  require: ops.set('require', {}, ['value'], [], [], [], ['value']),

  ternary: ops.set('ternary', {}, ['condition', 'truthy', 'falsy'], [], [], [], ['truthy', 'falsy']),

  // Comparisons

  isValid: ops.set('?', {}, ['value']),

  isEqual: ops.set('=', ANY_COMPLEXITY, ['value', 'test']),

  isNotEqual: ops.set('!=', ANY_COMPLEXITY, ['value', 'test']),

  isLess: ops.set('<', ANY_COMPLEXITY, ['value', 'test']),

  isLessOrEqual: ops.set('<=', ANY_COMPLEXITY, ['value', 'test']),

  isGreater: ops.set('>', ANY_COMPLEXITY, ['value', 'test']),

  isGreaterOrEqual: ops.set('>=', ANY_COMPLEXITY, ['value', 'test']),

  // Casts

  asAny: ops.set('~' + ID.Any, {}, ['value']),

  asBoolean: ops.set('~' + ID.Boolean, {}, ['value']),

  asColor: ops.set('~' + ID.Color, {}, ['value']),

  asDate: ops.set('~' + ID.Date, {}, ['value']),

  asList: ops.set('~' + ID.List, {}, ['value']),

  asMap: ops.set('~' + ID.Map, {}, ['value']),

  asNumber: ops.set('~' + ID.Number, {}, ['value']),

  asObject: ops.set('~' + ID.Object, {}, ['value']),

  asText: ops.set('~' + ID.Text, {}, ['value']),

  asTuple: ops.set('~' + ID.Tuple, {}, ['value']),

  asSet: ops.set('~' + ID.Set, {}, ['value']),

};
