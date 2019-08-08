
import { ListType } from '../types/List';
import { BooleanType } from '../types/Boolean';
import { NumberType } from '../types/Number';
import { AnyType } from '../types/Any';
import { ObjectType } from '../types/Object';
import { TextType } from '../types/Text';
import { GenericType } from '../types/Generic';


const ops = ListType.operations;

const iterationScope = (list: ListType) => ({ 
  list,
  item: list.options.item, 
  index: ListType.lengthType 
});

const iterationScopeDefaults = {
  list: 'list',
  item: 'item',
  index: 'index'
};

const compareScope = (list: ListType) => ({
  list,
  value: list.options.item,
  test: list.options.item
});

const compareScopeDefaults = {
  list: 'list',
  value: 'value',
  test: 'test'
};


export const ListOps = 
{

  // Operations

  add: ops.build('+', 
    (list) => [list, { list, item: list.options.item }]
  ),

  addFirst: ops.build('+f', 
    (list) => [list, { list, item: list.options.item }]
  ),

  addLast: ops.build('+l', 
    (list) => [list, { list, item: list.options.item }]
  ),

  insert: ops.build('+@', 
    (list) => [list, { list, item: list.options.item, index: NumberType }]
  ),

  remove: ops.build('-', 
    (list) => [NumberType, { list, item: list.options.item, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  removeFirst: ops.build('-f', 
    (list) => [list.options.item, { list }]
  ),

  removeLast: ops.build('-l', 
    (list) => [list.options.item, { list }]
  ),

  removeAt: ops.build('-@', 
    (list) => [list.options.item, { list, index: NumberType }]
  ),

  contains: ops.build('contains',
    (list) => [BooleanType, { list, item: list.options.item, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  copy: ops.build('copy', 
    (list) => [list, { list }, { deepCopy: list.options.item }, { copy: list.options.item }],
    { copy: 'copy' }
  ),

  reverse: ops.build('reverse', 
    (list) => [list, { list }]
  ),

  exclude: ops.build('exclude', 
    (list) => [list, { list, exclude: list, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  overlap: ops.build('overlap', 
    (list) => [list, { list, overlap: list, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  sort: ops.build('sort', 
    (list) => [list, { list, compare: NumberType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  shuffle: ops.build('shuffle', 
    (list) => [list, { list }, { times: NumberType }]
  ),

  unique: ops.build('unique', 
    (list) => [list, { list, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  duplicates: ops.build('dupes', 
    (list) => [list, { list, isEqual: BooleanType }, { once: BooleanType }, compareScope(list)],
    compareScopeDefaults
  ),

  take: ops.build('take', 
    (list) => [list, { list, count: NumberType }]
  ),

  skip: ops.build('skip', 
    (list) => [list, { list, count: NumberType }]
  ),

  drop: ops.build('drop', 
    (list) => [list, { list, count: NumberType }]
  ),

  append: ops.build('append', 
    (list) => [list, { list, append: list }]
  ),

  prepend: ops.build('prepend', 
    (list) => [list, { list, prepend: list }]
  ),

  indexOf: ops.build('indexOf', 
    (list) => [NumberType, { list, item: list.options.item, isEqual: BooleanType }, { start: NumberType }, compareScope(list)],
    compareScopeDefaults
  ),

  lastIndexOf: ops.build('lastIndexOf', 
    (list) => [NumberType, { list, item: list.options.item, isEqual: BooleanType }, { start: NumberType }, compareScope(list)],
    compareScopeDefaults
  ),

  last: ops.build('last', 
    (list) => [list.options.item, { list }]
  ),

  first: ops.build('first', 
    (list) => [list.options.item, { list }]
  ),

  count: ops.build('count', 
    (list) => [NumberType, { list }]
  ),

  randomList: ops.build('randomList', 
    (list) => [list, { list, count: NumberType }]
  ),

  random: ops.build('random', 
    (list) => [list.options.item, { list }]
  ),

  // Iteration

  join: ops.build('join',
    (list) => [TextType, { list }, { delimiter: TextType, toText: TextType, prefix: TextType, suffix: TextType }, iterationScope(list)],
    iterationScopeDefaults
  ),

  each: ops.build('each',
    (list) => [list, { list, each: AnyType }, { reverse: BooleanType }, iterationScope(list)],
    iterationScopeDefaults
  ),

  filter: ops.build('filter',
    (list) => [list, { list, filter: BooleanType }, {}, iterationScope(list)],
    iterationScopeDefaults
  ),

  not: ops.build('not',
    (list) => [list, { list, not: BooleanType }, {}, iterationScope(list)],
    iterationScopeDefaults
  ),

  map: ops.build('map',
    (list, generics) => [ListType.forItem(generics.M), { list, transform: generics.M }, {}, iterationScope(list)],
    iterationScopeDefaults,
    { M: new GenericType('M') }
  ),

  split: ops.build('split', 
    (list) => [new ObjectType({ props: { pass: list, fail: list } }), { list, pass: BooleanType }, {}, iterationScope(list)],
    iterationScopeDefaults
  ),

  reduce: ops.build('reduce', 
    (list, generics) => [generics.R, { list, reduce: generics.R, initial: generics.R }, {}, { list, item: list.options.item, reduced: generics.R, index: NumberType }],
    { ...iterationScopeDefaults, reduced: 'reduced' },
    { R: new GenericType('R') }
  ),

  cmp: ops.build('cmp', 
    (list) => [BooleanType, { list, test: list, compare: NumberType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  // Comparisons

  isEqual: ops.build('=', 
    (list) => [BooleanType, { list, test: list, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  isNotEqual: ops.build('!=', 
    (list) => [BooleanType, { list, test: list, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  isEmpty: ops.build('0?', 
    (list) => [BooleanType, { list }]
  ),

  isNotEmpty: ops.build('!0',
    (list) => [BooleanType, { list }]
  ),

  /**
  ONCE MAP: objectify, group
  */

};
