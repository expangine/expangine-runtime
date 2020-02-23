
import { Type, TypeInput } from '../../Type';
import { ListType } from '../../types/List';
import { BooleanType } from '../../types/Boolean';
import { NumberType } from '../../types/Number';
import { AnyType } from '../../types/Any';
import { TextType } from '../../types/Text';
import { MapType } from '../../types/Map';
import { DateType } from '../../types/Date';
import { ObjectType } from '../../types/Object';
import { TupleType } from '../../types/Tuple';

import { ListOps } from '../ListOps';
import { ColorType } from '../../types/Color';
import { SetType } from '../../types/Set';
import { Types } from '../../Types';


const ops = ListType.operations;

const RequireList = (list?: Type, otherwise?: TypeInput) => list instanceof ListType ? list : otherwise;
const ListItem = (list?: Type, otherwise?: TypeInput) => list instanceof ListType ? list.options.item : otherwise;
const GivenList = (i: {list?: Type}) => RequireList(i.list) || ListType;
const GivenValueList = (i: {value?: Type}) => RequireList(i.value) || ListType;
const GivenListItem = (i: {list?: Type}) => RequireList(i.list) ? i.list.options.item : AnyType;
const GivenListItemOptional = (i: {list?: Type}) => Types.optional(GivenListItem(i));
const GivenValueListItem = (i: {value?: Type}) => RequireList(i.value) ? i.value.options.item : AnyType;
const GivenReducer = (i: {reduce?: Type, initial?: Type}) => i.reduce || i.initial || AnyType;
const GivenListCompareScope = { list: GivenList, value: GivenListItem, test: GivenListItem };
const GivenValueListCompareScope = { list: GivenValueList, value: GivenValueListItem, test: GivenValueListItem };
const GivenListIterationScope = { list: GivenList, item: GivenListItem, index: NumberType };

export const ListOpsTypes = 
{

  // Static

  create: ops.setTypes(ListOps.create, ListType),

  createLike: ops.setTypes(ListOps.createLike, 
    GivenList,
    { list: GivenList },
  ),

  createFor: ops.setTypes(ListOps.createFor, 
    i => ListType.forItem(i.item || AnyType),
    { item: i => i.item || AnyType }
  ),

  // Operations

  maybe: ops.setTypes(ListOps.maybe, 
    (i, defs) => Types.maybe(i.value, ListType),
    { value: AnyType } 
  ),

  build: ops.setTypes(ListOps.build, 
    i => ListType.forItem(i.item || AnyType), 
    { count: NumberType, item: i => i.item || AnyType },
    { sameItem: BooleanType },
    { list: i => ListType.forItem(i.item || AnyType), index: NumberType, last: i => i.item || AnyType, count: NumberType }
  ),

  get: ops.setTypes(ListOps.get, 
    GivenListItemOptional, 
    { list: GivenList, index: NumberType }
  ),

  set: ops.setTypes(ListOps.set, 
    GivenListItemOptional, 
    { list: GivenList, index: NumberType, value: GivenListItem }
  ),

  add: ops.setTypes(ListOps.add, 
    GivenList,
    { list: GivenList, item: GivenListItem }
  ),

  addFirst: ops.setTypes(ListOps.addFirst, 
    GivenList,
    { list: GivenList, item: GivenListItem }
  ),

  addLast: ops.setTypes(ListOps.addLast, 
    GivenList,
    { list: GivenList, item: GivenListItem }
  ),

  insert: ops.setTypes(ListOps.insert, 
    GivenList,
    { list: GivenList, item: GivenListItem, index: NumberType }
  ),

  remove: ops.setTypes(ListOps.remove,  
    NumberType,
    { list: GivenList, item: GivenListItem, isEqual: BooleanType },
    {},
    GivenListCompareScope
  ),

  removeFirst: ops.setTypes(ListOps.removeFirst,
    GivenListItemOptional, 
    { list: GivenList }
  ),

  removeLast: ops.setTypes(ListOps.removeLast,
    GivenListItemOptional,
    { list: GivenList }
  ),

  removeAt: ops.setTypes(ListOps.removeAt,  
    GivenListItemOptional,
    { list: GivenList, index: NumberType }
  ),

  removeWhere: ops.setTypes(ListOps.removeWhere,  
    GivenList,
    { list: GivenList, where: BooleanType },
    {},
    GivenListIterationScope
  ),

  clear: ops.setTypes(ListOps.clear, 
    GivenList,
    { list: GivenList }
  ),

  contains: ops.setTypes(ListOps.contains,
    BooleanType,
    { list: GivenList, item: GivenListItem, isEqual: BooleanType },
    {},
    GivenListCompareScope
  ),

  find: ops.setTypes(ListOps.find,
    GivenListItemOptional,
    { list: GivenList, where: BooleanType },
    { reverse: BooleanType, start: NumberType },
    GivenListIterationScope
  ),

  copy: ops.setTypes(ListOps.copy,
    GivenList,
    { list: GivenList },
    { deepCopy: GivenListItem },
    { copy: GivenListItem }
  ),

  reverse: ops.setTypes(ListOps.reverse,
    GivenList,
    { list: GivenList }
  ),

  exclude: ops.setTypes(ListOps.exclude,  
    GivenList,
    { list: GivenList, exclude: GivenList, isEqual: BooleanType },
    {},
    GivenListCompareScope
  ),

  overlap: ops.setTypes(ListOps.overlap,  
    GivenList,
    { list: GivenList, overlap: GivenList, isEqual: BooleanType },
    {},
    GivenListCompareScope
  ),

  sort: ops.setTypes(ListOps.sort,   
    GivenList,
    { list: GivenList, compare: NumberType },
    {},
    GivenListCompareScope
  ),

  shuffle: ops.setTypes(ListOps.shuffle, 
    GivenList,
    { list: GivenList },
    { times: NumberType }
  ),

  unique: ops.setTypes(ListOps.unique,   
    GivenList,
    { list: GivenList, isEqual: BooleanType },
    {},
    GivenListCompareScope
  ),

  duplicates: ops.setTypes(ListOps.duplicates,  
    GivenList,
    { list: GivenList, isEqual: BooleanType },
    { once: BooleanType },
    GivenListCompareScope
  ),

  take: ops.setTypes(ListOps.take,
    GivenList,
    { list: GivenList, count: NumberType }
  ),

  skip: ops.setTypes(ListOps.skip,
    GivenList,
    { list: GivenList, count: NumberType }
  ),

  drop: ops.setTypes(ListOps.drop,
    GivenList,
    { list: GivenList, count: NumberType }
  ),

  append: ops.setTypes(ListOps.append,
    GivenList,
    { list: GivenList, append: GivenList }
  ),

  prepend: ops.setTypes(ListOps.prepend,
    GivenList,
    { list: GivenList, prepend: GivenList }
  ),

  indexOf: ops.setTypes(ListOps.indexOf,
    NumberType,
    { list: GivenList, item: GivenListItem, isEqual: BooleanType },
    { start: NumberType },
    GivenListCompareScope
  ),

  lastIndexOf: ops.setTypes(ListOps.lastIndexOf,
    NumberType,
    { list: GivenList, item: GivenListItem, isEqual: BooleanType },
    { start: NumberType },
    GivenListCompareScope
  ),

  findIndex: ops.setTypes(ListOps.findIndex,
    NumberType,
    { list: GivenList, where: BooleanType },
    { reverse: BooleanType, start: NumberType },
    GivenListIterationScope
  ),

  last: ops.setTypes(ListOps.last,
    GivenListItemOptional,
    { list: GivenList }
  ),

  first: ops.setTypes(ListOps.first,
    GivenListItemOptional,
    { list: GivenList }
  ),

  count: ops.setTypes(ListOps.count,
    NumberType,
    { list: GivenList }
  ),

  randomList: ops.setTypes(ListOps.randomList,
    GivenList,
    { list: GivenList, count: NumberType }
  ),

  random: ops.setTypes(ListOps.random,
    GivenListItemOptional,
    { list: GivenList }
  ),

  // Iteration

  join: ops.setTypes(ListOps.join,
    TextType,
    { list: GivenList },
    { delimiter: TextType, toText: TextType, prefix: TextType, suffix: TextType },
    GivenListIterationScope
  ),

  each: ops.setTypes(ListOps.each,
    GivenList,
    { list: GivenList, each: AnyType },
    { reverse: BooleanType },
    GivenListIterationScope
  ),

  filter: ops.setTypes(ListOps.filter,
    GivenList,
    { list: GivenList, filter: BooleanType }, 
    {}, 
    GivenListIterationScope
  ),

  not: ops.setTypes(ListOps.not,
    GivenList,
    { list: GivenList, not: BooleanType }, 
    {}, 
    GivenListIterationScope
  ),

  map: ops.setTypes(ListOps.map,
    i => ListType.forItem(i.transform || AnyType),
    { list: GivenList, transform: i => i.transform || AnyType },
    {},
    GivenListIterationScope
  ),

  split: ops.setTypes(ListOps.split,
    i => ObjectType.from({ pass: GivenList(i), fail: GivenList(i) }),
    { list: GivenList, pass: BooleanType },
    {},
    GivenListIterationScope
  ),

  reduce: ops.setTypes(ListOps.reduce,
    GivenReducer,
    { list: GivenList, reduce: GivenReducer, initial: GivenReducer },
    {},
    { list: GivenList, item: GivenListItem, reduced: GivenReducer, index: NumberType }
  ),

  cmp: ops.setTypes(ListOps.cmp,
    BooleanType,
    { value: GivenValueList, test: GivenValueList, compare: NumberType },
    {},
    GivenValueListCompareScope
  ),

  group: ops.setTypes(ListOps.group, 
    i => ListType.forItem(ObjectType.from({
      by: i.by || AnyType,
      group: ListType.forItem(i.getValue || GivenListItem(i)),
    })),
    { list: GivenList, by: i => i.by || AnyType },
    { getValue: i => i.getValue || GivenListItem(i) },
    GivenListIterationScope
  ),

  toListMap: ops.setTypes(ListOps.toListMap, 
    i => MapType.forItem(
      ListType.forItem(i.getValue || GivenListItem(i)), 
      i.getKey || AnyType
    ),
    { list: GivenList, getKey: i => i.getKey || AnyType },
    { getValue: i => i.getValue || GivenListItem(i) },
    GivenListIterationScope
  ),

  toMap: ops.setTypes(ListOps.toMap,
    i => MapType.forItem(
      i.getValue || GivenListItem(i), 
      i.getKey || AnyType
    ),
    { list: GivenList, getKey: i => i.getKey || AnyType },
    { getValue: i => i.getValue || GivenListItem(i) },
    GivenListIterationScope
  ),

  // Joins

  joinInner: ops.setTypes(ListOps.joinInner, 
    i => ListType.forItem(i.join || AnyType),
    { a: i => RequireList(i.a, ListType), b: i => RequireList(i.b, ListType), on: BooleanType, join: AnyType },
    { },
    { onA: i => ListItem(i.a, AnyType), onB: i => ListItem(i.b, AnyType), joinA: i => ListItem(i.a, AnyType), joinB: i => ListItem(i.b, AnyType) }
  ),

  joinLeft: ops.setTypes(ListOps.joinLeft, 
    i => ListType.forItem(i.join || AnyType),
    { a: i => RequireList(i.a, ListType), b: i => RequireList(i.b, ListType), on: BooleanType, join: AnyType },
    { },
    { onA: i => ListItem(i.a, AnyType), onB: i => ListItem(i.b, AnyType), joinA: i => ListItem(i.a, AnyType), joinB: i => Types.optional(ListItem(i.b, AnyType)) }
  ),

  joinRight: ops.setTypes(ListOps.joinRight, 
    i => ListType.forItem(i.join || AnyType),
    { a: i => RequireList(i.a, ListType), b: i => RequireList(i.b, ListType), on: BooleanType, join: AnyType },
    { },
    { onA: i => ListItem(i.a, AnyType), onB: i => ListItem(i.b, AnyType), joinA: i => Types.optional(ListItem(i.a, AnyType)), joinB: i => ListItem(i.b, AnyType) }
  ),

  joinFull: ops.setTypes(ListOps.joinFull, 
    i => ListType.forItem(i.join || AnyType),
    { a: i => RequireList(i.a, ListType), b: i => RequireList(i.b, ListType), on: BooleanType, join: AnyType },
    { },
    { onA: i => ListItem(i.a, AnyType), onB: i => ListItem(i.b, AnyType), joinA: i => Types.optional(ListItem(i.a, AnyType)), joinB: i => Types.optional(ListItem(i.b, AnyType)) }
  ),

  joinCross: ops.setTypes(ListOps.joinCross, 
    i => ListType.forItem(i.join || AnyType),
    { a: i => RequireList(i.a, ListType), b: i => RequireList(i.b, ListType), join: AnyType },
    { },
    { joinA: i => ListItem(i.a, AnyType), joinB: i => ListItem(i.b, AnyType) }
  ),

  // Aggregates

  min: ops.setTypes(ListOps.min,
    Types.optional(NumberType),
    { list: GivenList, value: NumberType },
    {},
    GivenListIterationScope
  ),

  max: ops.setTypes(ListOps.max,
    Types.optional(NumberType),
    { list: GivenList, value: NumberType },
    {},
    GivenListIterationScope
  ),

  sum: ops.setTypes(ListOps.sum,
    Types.optional(NumberType),
    { list: GivenList, value: NumberType },
    {},
    GivenListIterationScope
  ),

  avg: ops.setTypes(ListOps.avg,
    Types.optional(NumberType),
    { list: GivenList, value: NumberType },
    {},
    GivenListIterationScope
  ),

  std: ops.setTypes(ListOps.std,
    Types.optional(NumberType),
    { list: GivenList, value: NumberType },
    {},
    GivenListIterationScope
  ),

  variance: ops.setTypes(ListOps.variance,
    Types.optional(NumberType),
    { list: GivenList, value: NumberType },
    {},
    GivenListIterationScope
  ),

  median: ops.setTypes(ListOps.median,
    Types.optional(NumberType),
    { list: GivenList, value: NumberType },
    {},
    GivenListIterationScope
  ),

  bitand: ops.setTypes(ListOps.bitand,
    NumberType,
    { list: GivenList, value: NumberType },
    {},
    GivenListIterationScope
  ),

  bitor: ops.setTypes(ListOps.bitor,
    NumberType,
    { list: GivenList, value: NumberType },
    {},
    GivenListIterationScope
  ),

  bitxor: ops.setTypes(ListOps.bitxor,
    NumberType,
    { list: GivenList, value: NumberType },
    {},
    GivenListIterationScope
  ),

  // Comparisons

  isValid: ops.setTypes(ListOps.isValid, 
    BooleanType, 
    { value: AnyType }
  ),

  isEmpty: ops.setTypes(ListOps.isEmpty,
    BooleanType,
    { list: GivenList }
  ),

  isNotEmpty: ops.setTypes(ListOps.isNotEmpty,
    BooleanType,
    { list: GivenList }
  ),

  isEqual: ops.setTypes(ListOps.isEqual,
    BooleanType,
    { list: GivenList, test: GivenList, isEqual: BooleanType },
    {},
    GivenListCompareScope
  ),

  isNotEqual: ops.setTypes(ListOps.isNotEqual,
    BooleanType,
    { list: GivenList, test: GivenList, isEqual: BooleanType },
    {},
    GivenListCompareScope
  ),

  isLess: ops.setTypes(ListOps.isLess, 
    BooleanType,
    { value: GivenValueList, test: GivenValueList, compare: NumberType },
    {},
    GivenValueListCompareScope
  ),

  isLessOrEqual: ops.setTypes(ListOps.isLessOrEqual, 
    BooleanType,
    { value: GivenValueList, test: GivenValueList, compare: NumberType },
    {},
    GivenValueListCompareScope
  ),

  isGreater: ops.setTypes(ListOps.isGreater, 
    BooleanType,
    { value: GivenValueList, test: GivenValueList, compare: NumberType },
    {},
    GivenValueListCompareScope
  ),

  isGreaterOrEqual: ops.setTypes(ListOps.isGreaterOrEqual, 
    BooleanType,
    { value: GivenValueList, test: GivenValueList, compare: NumberType },
    {},
    GivenValueListCompareScope
  ),

  // Casts
  

  asAny: ops.setTypes(ListOps.asAny, 
    AnyType, 
    { value: GivenValueList }
  ),

  asBoolean: ops.setTypes(ListOps.asBoolean, 
    BooleanType,
    { value: GivenValueList }
  ),

  asColor: ops.setTypes(ListOps.asColor, 
    ColorType, 
    { value: GivenValueList }
  ),

  asDate: ops.setTypes(ListOps.asDate, 
    DateType,
    { value: GivenValueList }
  ),

  asList: ops.setTypes(ListOps.asList, 
    GivenValueList,
    { value: GivenValueList }
  ),

  asMap: ops.setTypes(ListOps.asMap,
    i => MapType.forItem(GivenValueListItem(i)),
    { value: GivenValueList }
  ),

  asNumber: ops.setTypes(ListOps.asNumber, 
    NumberType,
    { value: GivenValueList }
  ),

  asObject: ops.setTypes(ListOps.asObject,
    ObjectType,
    { value: GivenValueList }
  ),

  asText: ops.setTypes(ListOps.asText, 
    TextType,
    { value: GivenValueList }
  ),

  asTuple: ops.setTypes(ListOps.asTuple, 
    TupleType,
    { value: GivenValueList }
  ),

  asSet: ops.setTypes(ListOps.asSet, 
    i => SetType.forItem(GivenValueListItem(i)), 
    { value: GivenValueList }
  ),
  
};
