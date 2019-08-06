
import { ListType } from '../types/List';
import { BooleanType } from '../types/Boolean';


const ops = ListType.operations;

const iterationScope = (list: ListType) => ({ 
  list,
  item: list.options.item, 
  index: ListType.lengthType 
});


export const ListOps = {

  add: ops.build('+', 
    (list) => [list, { list, item: list.options.item }]
  ),

  filter: ops.build('filter',
    (list) => [list, { list, filter: BooleanType.baseType }, {}, iterationScope(list)]
  )
};

/**

+ add (a, b: T) => List
- subtract (a, b: T) => List
addFirst (a, b: T) => List
addLast (a, b: T) => List
addAt
removeFirst
removeLast
removeAt

where filter (a, b: (T) => Boolean) => List
not filter not (a, b: (T) => Boolean) => List
transform transform (a, b: (T) => R) => List
reverse reverse item order (a) => List
exclude the items from this list and not in the given list (a, b: List, c: (T, T) => Boolean) => List
intersect the items they have in common (a, b: List, c: (T, T) => Boolean) => List
sort sort values by comparator (a, sorter: (T, T) => Number) => List
shuffle move values around (a, times: Number) => List
unique return only unique values (a, b: (T, T) => Boolean) => List
duplicates return only the duplicates (a, b: (T, T) => Boolean, onlyOnce: Boolean> => List
take take first # items (a, count: Number) => List
skip skip first # items (a, count: Number) => List
drop ignore last # items (a, count: Number) => List
append add list to end (a, b: List) => List
prepend add list to beginning (a, b: List) => List
split split list into two based on condition (a, splitter: (T) => Boolean) => { pass: List, fail: List }
delete removes all values in list (a) => List
extract removes all values from underlying list and returns new (a) => List
indexOf index of (a, b: (T) => Boolean) => Number
lastIndexOf last index of (a, b: (T) => Boolean) => Number
first return first item (a) => T
last return last item (a) => T
count (a) => Number
objectify convert to object<K, R> (a, b: (T) => K, c: (T) => R) => { [K]: R }
group convert to object<K: Text> (a, b: (T) => K): { [K]: { list: List, key: K } }
reduceSimple reduce using simple operation (a, b: (T, T) => T) => T
reduce reduce more complex (a, b: (T, R) => R, initial: R) => R
randomList choose # number items (a, b: Number) => List
random choose random item (a) => T

join

=
!=
empty is list empty (a) => Boolean
has is list not empty (a) => Boolean
contains list has item (a, b: T) => Boolean
 */