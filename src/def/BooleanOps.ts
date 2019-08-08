
import { BooleanType } from '../types/Boolean';
import { NumberType } from '../types/Number';


const ops = BooleanType.operations;


export const BooleanOps = 
{

  // Operations

  and: ops.set('&', BooleanType, { a: BooleanType, b: BooleanType }),

  or: ops.set('|', BooleanType, { a: BooleanType, b: BooleanType }),

  xor: ops.set('^', BooleanType, { a: BooleanType, b: BooleanType }),

  not: ops.set('!', BooleanType, { a: BooleanType }),

  cmp: ops.set('cmp', NumberType, { value: BooleanType, test: BooleanType }),

  // Comparisons

  isValid: ops.set('?', BooleanType, { value: BooleanType }),

  isTrue: ops.set('t?', BooleanType, { value: BooleanType }),

  isFalse: ops.set('f?', BooleanType, { value: BooleanType }),

};