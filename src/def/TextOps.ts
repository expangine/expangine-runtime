
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { TextType } from '../types/Text';
import { ListType } from '../types/List';


const ops = TextType.operations;
const TextListType = ListType.forItem(TextType);


export const TextOps = 
{

  // Operations

  append: ops.set('+', TextType, { value: TextType, append: TextType }),

  prepend: ops.set('pre', TextType, { value: TextType, prepend: TextType }),

  lower: ops.set('lo', TextType, { value: TextType }),

  upper: ops.set('up', TextType, { value: TextType }),

  char: ops.set('@', TextType, { value: TextType, index: NumberType }, { outside: TextType }),

  replace: ops.set('replace', TextType, { value: TextType, find: TextType, replace: TextType }),

  repeat: ops.set('repeat', TextType, { value: TextType, times: NumberType }),

  split: ops.set('split', TextListType, { value: TextType, by: TextType }, { limit: NumberType }),

  chars: ops.set('chars', TextListType, { value: TextType }),

  sub: ops.set('sub', TextType, { value: TextType, start: NumberType }, { end: NumberType }),

  indexOf: ops.set('i?', NumberType, { value: TextType, search: TextType }, { start: NumberType }),

  lastIndexOf: ops.set('li?', NumberType, { value: TextType, search: TextType }, { start: NumberType }),

  trim: ops.set('trim', TextType, { value: TextType }, { start: BooleanType, end: BooleanType }),

  startsWith: ops.set('starts', BooleanType, { value: TextType, test: TextType }),

  endsWith: ops.set('ends', BooleanType, { value: TextType, test: TextType }),

  soundex: ops.set('soundex', TextType, { value: TextType }, { max: NumberType, min: NumberType }),

  distance: ops.set('dist', NumberType, { value: TextType, test: TextType }),

  length: ops.set('len', NumberType, { value: TextType }),

  compare: ops.set('cmp', NumberType, { value: TextType, test: TextType }, { ignoreCase: BooleanType }),

  // Other

  // Generators

  // Formatters

  toNumber: ops.set('toNumber', NumberType, { value: TextType }, { invalidValue: NumberType }),
  
  // Comparisons

  isValid: ops.set('?', BooleanType, { a: TextType }),

  isEmpty: ops.set('0?', BooleanType, { a: TextType }),

  isNotEmpty: ops.set('n?', BooleanType, { a: TextType }),

  isEqual: ops.set('=', BooleanType, { a: TextType, b: TextType }, { ignoreCase: BooleanType }),

  isNotEqual: ops.set('!=', BooleanType, { a: TextType, b: TextType }, { ignoreCase: BooleanType }),

  isLess: ops.set('<', BooleanType, { value: TextType, test: TextType }, { ignoreCase: BooleanType }),

  isLessOrEqual: ops.set('<=', BooleanType, { value: TextType, test: TextType }, { ignoreCase: BooleanType }),

  isGreater: ops.set('>', BooleanType, { value: TextType, test: TextType }, { ignoreCase: BooleanType }),

  isGreaterOrEqual: ops.set('>=', BooleanType, { value: TextType, test: TextType }, { ignoreCase: BooleanType }),

  isLower: ops.set('lo?', BooleanType, { value: TextType }),

  isUpper: ops.set('up?', BooleanType, { value: TextType }),

};
