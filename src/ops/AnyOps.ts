
import { AnyType } from '../types/Any';
import { BooleanType } from '../types/Boolean';
import { DateType } from '../types/Date';
import { ListType } from '../types/List';
import { MapType } from '../types/Map';
import { NumberType } from '../types/Number';
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
