
import { AnyType } from '../types/Any';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';


const ops = AnyType.operations;


export const AnyOps = 
{

  // Operations

  cmp: ops.set('cmp', NumberType, { value: AnyType, test: AnyType }),

  copy: ops.set('copy', AnyType, { value: AnyType }),

  // Comparisons

  isEqual: ops.set('=', BooleanType, { value: AnyType, test: AnyType }),

  isNotEqual: ops.set('!=', BooleanType, { value: AnyType, test: AnyType }),

  isLess: ops.set('<', BooleanType, { value: AnyType, test: AnyType }),

  isLessOrEqual: ops.set('<=', BooleanType, { value: AnyType, test: AnyType }),

  isGreater: ops.set('>', BooleanType, { value: AnyType, test: AnyType }),

  isGreaterOrEqual: ops.set('>=', BooleanType, { value: AnyType, test: AnyType }),

};
