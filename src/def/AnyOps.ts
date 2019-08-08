
import { AnyType } from '../types/Any';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';


const ops = AnyType.operations;


const ANY_COMPLEXITY = {
  complexity: 2
};

export const AnyOps = 
{

  // Operations

  cmp: ops.set('cmp', ANY_COMPLEXITY, NumberType, { value: AnyType, test: AnyType }),

  copy: ops.set('copy', ANY_COMPLEXITY, AnyType, { value: AnyType }),

  // Comparisons

  isEqual: ops.set('=', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

  isNotEqual: ops.set('!=', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

  isLess: ops.set('<', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

  isLessOrEqual: ops.set('<=', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

  isGreater: ops.set('>', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

  isGreaterOrEqual: ops.set('>=', ANY_COMPLEXITY, BooleanType, { value: AnyType, test: AnyType }),

};
