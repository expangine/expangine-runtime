
import { ListType } from '../types/List';
import { BooleanType } from '../types/Boolean';
import { NumberType } from '../types/Number';
import { AnyType } from '../types/Any';
import { TextType } from '../types/Text';
import { GenericType } from '../types/Generic';
import { MapType } from '../types/Map';


const ops = ListType.operations;

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
    (list) => [NumberType, { list, item: list.options.item, isEqual: BooleanType }, {}, list.getCompareScope()],
    ListType.CompareScopeDefaults
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
    (list) => [BooleanType, { list, item: list.options.item, isEqual: BooleanType }, {}, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  copy: ops.build('copy', { complexity: 1 },
    (list) => [list, { list }, { deepCopy: list.options.item }, { copy: list.options.item }],
    { copy: 'copy' }
  ),

  reverse: ops.build('reverse', { complexity: 0.5 },
    (list) => [list, { list }]
  ),

  exclude: ops.build('exclude', { mutates: ['list'], complexity: 2 },  
    (list) => [list, { list, exclude: list, isEqual: BooleanType }, {}, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  overlap: ops.build('overlap', { complexity: 2 },  
    (list) => [list, { list, overlap: list, isEqual: BooleanType }, {}, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  sort: ops.build('sort', { mutates: ['list'], complexity: 1 },   
    (list) => [list, { list, compare: NumberType }, {}, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  shuffle: ops.build('shuffle', { mutates: ['list'], complexity: 1 },   
    (list) => [list, { list }, { times: NumberType }]
  ),

  unique: ops.build('unique', { complexity: 2 },   
    (list) => [list, { list, isEqual: BooleanType }, {}, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  duplicates: ops.build('dupes', { complexity: 2 },  
    (list) => [list, { list, isEqual: BooleanType }, { once: BooleanType }, list.getCompareScope()],
    ListType.CompareScopeDefaults
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
    (list) => [NumberType, { list, item: list.options.item, isEqual: BooleanType }, { start: NumberType }, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  lastIndexOf: ops.build('lastIndexOf', { complexity: 1 },
    (list) => [NumberType, { list, item: list.options.item, isEqual: BooleanType }, { start: NumberType }, list.getCompareScope()],
    ListType.CompareScopeDefaults
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
    (list) => [TextType, { list }, { delimiter: TextType, toText: TextType, prefix: TextType, suffix: TextType }, list.getIterationScope()],
    ListType.IterationScopeDefaults
  ),

  each: ops.build('each', { complexity: 1 },
    (list) => [list, { list, each: AnyType }, { reverse: BooleanType }, list.getIterationScope()],
    ListType.IterationScopeDefaults
  ),

  filter: ops.build('filter', { complexity: 1 },
    (list) => [list, { list, filter: BooleanType }, {}, list.getIterationScope()],
    ListType.IterationScopeDefaults
  ),

  not: ops.build('not', { complexity: 1 },
    (list) => [list, { list, not: BooleanType }, {}, list.getIterationScope()],
    ListType.IterationScopeDefaults
  ),

  map: ops.build('map', { complexity: 1},
    (list, generics) => [ListType.forItem(generics.M), { list, transform: generics.M }, {}, list.getIterationScope()],
    ListType.IterationScopeDefaults,
    { M: new GenericType('M') }
  ),

  split: ops.build('split', { complexity: 1},
    (list) => [list.getSplitResultType(), { list, pass: BooleanType }, {}, list.getIterationScope()],
    ListType.IterationScopeDefaults
  ),

  reduce: ops.build('reduce', { complexity: 1},
    (list, generics) => [generics.R, { list, reduce: generics.R, initial: generics.R }, {}, { list, item: list.options.item, reduced: generics.R, index: NumberType }],
    { ...ListType.IterationScopeDefaults, reduced: 'reduced' },
    { R: new GenericType('R') }
  ),

  cmp: ops.build('cmp', { complexity: 1 },
    (list) => [BooleanType, { value: list, test: list, compare: NumberType }, {}, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  group: ops.build('group', { complexity: 1 }, 
    (list, generics) => [new MapType({ key: generics.K, value: ListType.forItem(generics.V) }), { list, getKey: generics.K }, { getValue: generics.V }, list.getIterationScope()],
    ListType.IterationScopeDefaults,
    { K: new GenericType('K'), V: new GenericType('V') }
  ),

  toMap: ops.build('toMap', { complexity: 1 },
    (list, generics) => [new MapType({ key: generics.K, value: generics.V }), { list, getKey: generics.K }, { getValue: generics.V }, list.getIterationScope()],
    ListType.IterationScopeDefaults,
    { K: new GenericType('K'), V: new GenericType('V') }
  ),

  // Comparisons

  isEmpty: ops.build('0?', {},
    (list) => [BooleanType, { list }]
  ),

  isNotEmpty: ops.build('!0', {},
    (list) => [BooleanType, { list }]
  ),

  isEqual: ops.build('=', { complexity: 1},
    (list) => [BooleanType, { list, test: list, isEqual: BooleanType }, {}, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  isNotEqual: ops.build('!=', { complexity: 1},
    (list) => [BooleanType, { list, test: list, isEqual: BooleanType }, {}, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  isLess: ops.build('<', { complexity: 1 }, 
    (list) => [BooleanType, { value: list, test: list, compare: NumberType }, { }, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  isLessOrEqual: ops.build('<=', { complexity: 1 }, 
    (list) => [BooleanType, { value: list, test: list, compare: NumberType }, { }, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  isGreater: ops.build('>', { complexity: 1 }, 
    (list) => [BooleanType, { value: list, test: list, compare: NumberType }, { }, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

  isGreaterOrEqual: ops.build('>=', { complexity: 1 }, 
    (list) => [BooleanType, { value: list, test: list, compare: NumberType }, { }, list.getCompareScope()],
    ListType.CompareScopeDefaults
  ),

};
