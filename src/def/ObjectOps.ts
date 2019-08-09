
import { ObjectType } from '../types/Object';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { TextType } from '../types/Text';
import { AnyType } from '../types/Any';


const ops = ObjectType.operations;


export const ObjectOps = 
{

  // Operations

  has: ops.build('has', {}, 
    (object) => [BooleanType, { object, key: TextType }]
  ),

  get: ops.build('get', {}, 
    (object) => [AnyType, { object, key: TextType }]
  ),

  set: ops.build('set', { mutates: ['object'] }, 
    (object) => [object, { object, key: TextType, value: AnyType }]
  ),

  cmp: ops.build('cmp', {}, 
    (object) => [NumberType, { value: object, test: object }]
  ),

  copy: ops.build('copy', {}, 
    (object) => [object, { object }]
  ),

  // Comparisons

  isEqual: ops.build('=', {}, 
    (object) => [BooleanType, { value: AnyType, test: AnyType }]
  ),

  isNotEqual: ops.build('!=', {}, 
    (object) => [BooleanType, { value: AnyType, test: AnyType }]
  ),

  isLess: ops.build('<', {}, 
    (object) => [BooleanType, { value: AnyType, test: AnyType }]
  ),

  isLessOrEqual: ops.build('<=', {}, 
    (object) => [BooleanType, { value: AnyType, test: AnyType }]
  ),

  isGreater: ops.build('>', {}, 
    (object) => [BooleanType, { value: AnyType, test: AnyType }]
  ),

  isGreaterOrEqual: ops.build('>=', {}, 
    (object) => [BooleanType, { value: AnyType, test: AnyType }]
  ),

};
