
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

  create: ops.build('new', {}, 
    (_, generics) => [ListType.forItem(generics.T), { count: NumberType, item: generics.T }, { sameItem: BooleanType }, { list: ListType.forItem(generics.T), index: NumberType, last: generics.T, count: NumberType }],
    { list: 'list', index: 'index', last: 'last', count: 'count' },
    { T: new GenericType('T') }
  ),

  get: ops.build('get', {}, 
    (list) => [list.options.item, { list, index: NumberType }]
  ),

  set: ops.build('set', {}, 
    (list) => [list.options.item, { list, index: NumberType, value: list.options.item }]
  ),

  add: ops.build('+', { mutates: ['list'] }, 
    (list) => [list, { list, item: list.options.item }]
  ),

  addFirst: ops.build('+f', { mutates: ['list'] }, 
    (list) => [list, { list, item: list.options.item }]
  ),

  addLast: ops.build('+l', { mutates: ['list'] }, 
    (list) => [list, { list, item: list.options.item }]
  ),

  insert: ops.build('+@', { mutates: ['list'] }, 
    (list) => [list, { list, item: list.options.item, index: NumberType }]
  ),

  remove: ops.build('-', { mutates: ['list'], complexity: 1 },  
    (list) => [NumberType, { list, item: list.options.item, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  removeFirst: ops.build('-f', { mutates: ['list'] },  
    (list) => [list.options.item, { list }]
  ),

  removeLast: ops.build('-l', { mutates: ['list'] }, 
    (list) => [list.options.item, { list }]
  ),

  removeAt: ops.build('-@', { mutates: ['list'] },  
    (list) => [list.options.item, { list, index: NumberType }]
  ),

  contains: ops.build('contains', { complexity: 1 },
    (list) => [BooleanType, { list, item: list.options.item, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  copy: ops.build('copy', { complexity: 1 },
    (list) => [list, { list }, { deepCopy: list.options.item }, { copy: list.options.item }],
    { copy: 'copy' }
  ),

  reverse: ops.build('reverse', { complexity: 0.5 },
    (list) => [list, { list }]
  ),

  exclude: ops.build('exclude', { mutates: ['list'], complexity: 2 },  
    (list) => [list, { list, exclude: list, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  overlap: ops.build('overlap', { complexity: 2 },  
    (list) => [list, { list, overlap: list, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  sort: ops.build('sort', { mutates: ['list'], complexity: 1 },   
    (list) => [list, { list, compare: NumberType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  shuffle: ops.build('shuffle', { mutates: ['list'], complexity: 1 },   
    (list) => [list, { list }, { times: NumberType }]
  ),

  unique: ops.build('unique', { complexity: 2 },   
    (list) => [list, { list, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  duplicates: ops.build('dupes', { complexity: 2 },  
    (list) => [list, { list, isEqual: BooleanType }, { once: BooleanType }, compareScope(list)],
    compareScopeDefaults
  ),

  take: ops.build('take', { mutates: ['list'] },
    (list) => [list, { list, count: NumberType }]
  ),

  skip: ops.build('skip', { mutates: ['list'] },
    (list) => [list, { list, count: NumberType }]
  ),

  drop: ops.build('drop', { mutates: ['list'] },
    (list) => [list, { list, count: NumberType }]
  ),

  append: ops.build('append', {},
    (list) => [list, { list, append: list }]
  ),

  prepend: ops.build('prepend', {},
    (list) => [list, { list, prepend: list }]
  ),

  indexOf: ops.build('indexOf', { complexity: 1 },
    (list) => [NumberType, { list, item: list.options.item, isEqual: BooleanType }, { start: NumberType }, compareScope(list)],
    compareScopeDefaults
  ),

  lastIndexOf: ops.build('lastIndexOf', { complexity: 1 },
    (list) => [NumberType, { list, item: list.options.item, isEqual: BooleanType }, { start: NumberType }, compareScope(list)],
    compareScopeDefaults
  ),

  last: ops.build('last', {},
    (list) => [list.options.item, { list }]
  ),

  first: ops.build('first', {},
    (list) => [list.options.item, { list }]
  ),

  count: ops.build('count', {},
    (list) => [NumberType, { list }]
  ),

  randomList: ops.build('randomList', {},
    (list) => [list, { list, count: NumberType }]
  ),

  random: ops.build('random', {},
    (list) => [list.options.item, { list }]
  ),

  // Iteration

  join: ops.build('join', { complexity: 1 },
    (list) => [TextType, { list }, { delimiter: TextType, toText: TextType, prefix: TextType, suffix: TextType }, iterationScope(list)],
    iterationScopeDefaults
  ),

  each: ops.build('each', { complexity: 1 },
    (list) => [list, { list, each: AnyType }, { reverse: BooleanType }, iterationScope(list)],
    iterationScopeDefaults
  ),

  filter: ops.build('filter', { complexity: 1 },
    (list) => [list, { list, filter: BooleanType }, {}, iterationScope(list)],
    iterationScopeDefaults
  ),

  not: ops.build('not', { complexity: 1 },
    (list) => [list, { list, not: BooleanType }, {}, iterationScope(list)],
    iterationScopeDefaults
  ),

  map: ops.build('map', { complexity: 1},
    (list, generics) => [ListType.forItem(generics.M), { list, transform: generics.M }, {}, iterationScope(list)],
    iterationScopeDefaults,
    { M: new GenericType('M') }
  ),

  split: ops.build('split', { complexity: 1},
    (list) => [new ObjectType({ props: { pass: list, fail: list } }), { list, pass: BooleanType }, {}, iterationScope(list)],
    iterationScopeDefaults
  ),

  reduce: ops.build('reduce', { complexity: 1},
    (list, generics) => [generics.R, { list, reduce: generics.R, initial: generics.R }, {}, { list, item: list.options.item, reduced: generics.R, index: NumberType }],
    { ...iterationScopeDefaults, reduced: 'reduced' },
    { R: new GenericType('R') }
  ),

  cmp: ops.build('cmp', { complexity: 1 },
    (list) => [BooleanType, { list, test: list, compare: NumberType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  // Comparisons

  isEqual: ops.build('=', { complexity: 1},
    (list) => [BooleanType, { list, test: list, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  isNotEqual: ops.build('!=', { complexity: 1},
    (list) => [BooleanType, { list, test: list, isEqual: BooleanType }, {}, compareScope(list)],
    compareScopeDefaults
  ),

  isEmpty: ops.build('0?', {},
    (list) => [BooleanType, { list }]
  ),

  isNotEmpty: ops.build('!0', {},
    (list) => [BooleanType, { list }]
  ),

  /**
  ONCE MAP: objectify, group
  */

};
