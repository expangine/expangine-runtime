
import { TupleType } from '../types/Tuple';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { AnyType } from '../types/Any';


const ops = TupleType.operations;


export const TupleOps = 
{

  // Statics

  create: ops.set('create', {}, TupleType ),

  // Operations

  cmp: ops.set('cmp', {}, NumberType, { value: TupleType, test: TupleType }),

  copy: ops.set('copy', {}, TupleType, { value: TupleType }),

  get: ops.set('get', {}, AnyType, { value: TupleType, index: NumberType }),

  set: ops.set('set', { mutates: ['value'] }, AnyType, { value: TupleType, index: NumberType, element: AnyType }),

  // Comparisons

  isEqual: ops.set('=', {}, BooleanType, { value: TupleType, test: TupleType }),

  isNotEqual: ops.set('!=', {}, BooleanType, { value: TupleType, test: TupleType }),

  isLess: ops.set('<', {}, BooleanType, { value: TupleType, test: TupleType }),

  isLessOrEqual: ops.set('<=', {}, BooleanType, { value: TupleType, test: TupleType }),

  isGreater: ops.set('>', {}, BooleanType, { value: TupleType, test: TupleType }),

  isGreaterOrEqual: ops.set('>=', {}, BooleanType, { value: TupleType, test: TupleType }),

};
