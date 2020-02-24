
import { NumberType } from '../../types/Number';
import { BooleanType } from '../../types/Boolean';
import { TextType } from '../../types/Text';
import { ListType } from '../../types/List';
import { AnyType } from '../../types/Any';
import { DateType } from '../../types/Date';
import { MapType } from '../../types/Map';
import { ObjectType } from '../../types/Object';
import { TupleType } from '../../types/Tuple';

import { TextOps } from '../TextOps';
import { ColorType } from '../../types/Color';
import { SetType } from '../../types/Set';
import { Types } from '../../Types';


const ops = TextType.operations;
const TextListType = ListType.forItem(TextType);
const RegexMatchType = Types.object({
  index: NumberType,
  lastIndex: NumberType,
  input: TextType,
  groups: TextListType,
});


export const TextOpsTypes = 
{

  // Statics

  create: ops.setTypes(TextOps.create, TextType),

  uuid: ops.setTypes(TextOps.uuid, TextType),

  // Operations

  maybe: ops.setTypes(TextOps.maybe, 
    (i) => Types.maybe(i.value, TextType),
    { value: AnyType } 
  ),

  append: ops.setTypes(TextOps.append, TextType, { value: TextType, append: TextType }),

  prepend: ops.setTypes(TextOps.prepend, TextType, { value: TextType, prepend: TextType }),

  lower: ops.setTypes(TextOps.lower, TextType, { value: TextType }),

  upper: ops.setTypes(TextOps.upper, TextType, { value: TextType }),

  char: ops.setTypes(TextOps.char, TextType, { value: TextType, index: NumberType }, { outside: TextType }),

  replace: ops.setTypes(TextOps.replace, TextType, { value: TextType, find: TextType, replace: TextType }),

  repeat: ops.setTypes(TextOps.repeat, TextType, { value: TextType, times: NumberType }),

  split: ops.setTypes(TextOps.split, TextListType, { value: TextType, by: TextType }, { limit: NumberType }),

  chars: ops.setTypes(TextOps.chars, TextListType, { value: TextType }),

  sub: ops.setTypes(TextOps.sub, TextType, { value: TextType }, { start: NumberType, end: NumberType }),

  indexOf: ops.setTypes(TextOps.indexOf, NumberType, { value: TextType, search: TextType }, { start: NumberType }),

  lastIndexOf: ops.setTypes(TextOps.lastIndexOf, NumberType, { value: TextType, search: TextType }, { start: NumberType }),

  trim: ops.setTypes(TextOps.trim, TextType, { value: TextType }, { start: BooleanType, end: BooleanType }),

  startsWith: ops.setTypes(TextOps.startsWith, BooleanType, { value: TextType, test: TextType }),

  endsWith: ops.setTypes(TextOps.endsWith, BooleanType, { value: TextType, test: TextType }),

  soundex: ops.setTypes(TextOps.soundex, TextType, { value: TextType }, { max: NumberType, min: NumberType }),

  metaphone: ops.setTypes(TextOps.metaphone, TextType, { value: TextType }),

  distance: ops.setTypes(TextOps.distance, NumberType, { value: TextType, test: TextType }),

  length: ops.setTypes(TextOps.length, NumberType, { value: TextType }),

  compare: ops.setTypes(TextOps.compare, NumberType, { value: TextType, test: TextType }, { ignoreCase: BooleanType }),

  like: ops.setTypes(TextOps.like, BooleanType, { value: TextType, pattern: TextType }, { ignoreCase: BooleanType }),

  pad: ops.setTypes(TextOps.pad, TextType, { value: TextType, padding: TextType, min: NumberType }, { max: NumberType, append: BooleanType }),

  regexTest: ops.setTypes(TextOps.regexTest, BooleanType, { value: TextType, regex: TextType }, { ignoreCase: BooleanType, multiline: BooleanType }),

  regexSplit: ops.setTypes(TextOps.regexSplit, TextListType, { value: TextType, regex: TextType }, { limit: NumberType, ignoreCase: BooleanType, multiline: BooleanType }),

  regexMatch: ops.setTypes(TextOps.regexMatch, TextListType, { value: TextType, regex: TextType }, { ignoreCase: BooleanType, multiline: BooleanType }),

  regexMatchAll: ops.setTypes(TextOps.regexMatchAll, 
    ListType.forItem(RegexMatchType), 
    { value: TextType, regex: TextType }, 
    { ignoreCase: BooleanType, multiline: BooleanType }
  ),

  regexReplace: ops.setTypes(TextOps.regexReplace, 
    TextType, 
    { value: TextType, regex: TextType, replacement: TextType },
    { all: BooleanType, ignoreCase: BooleanType, multiline: BooleanType },
  ),

  regexReplaceDynamic: ops.setTypes(TextOps.regexReplaceDynamic, 
    TextType, 
    { value: TextType, regex: TextType, replace: TextType },
    { all: BooleanType, ignoreCase: BooleanType, multiline: BooleanType },
    { match: RegexMatchType }
  ),

  regexIndexOf: ops.setTypes(TextOps.regexIndexOf, NumberType, { value: TextType, regex: TextType }, { ignoreCase: BooleanType, multiline: BooleanType }),

  // Other

  // Generators

  // Formatters

  base64: ops.setTypes(TextOps.base64, TextType, { value: TextType }),

  unbase64: ops.setTypes(TextOps.unbase64, TextType, { value: TextType }),

  encodeURI: ops.setTypes(TextOps.encodeURI, TextType, { value: TextType }),

  decodeURI: ops.setTypes(TextOps.decodeURI, TextType, { value: TextType }),

  encodeURIComponent: ops.setTypes(TextOps.encodeURIComponent, TextType, { value: TextType }),

  decodeURIComponent: ops.setTypes(TextOps.decodeURIComponent, TextType, { value: TextType }),

  md5: ops.setTypes(TextOps.md5, TextType, { value: TextType }),

  encrypt: ops.setTypes(TextOps.encrypt, TextType, { value: TextType, secret: TextType }),

  decrypt: ops.setTypes(TextOps.decrypt, TextType, { value: TextType, secret: TextType }),

  toNumber: ops.setTypes(TextOps.toNumber, NumberType, { value: TextType }, { invalidValue: NumberType }),
  
  // Comparisons

  isValid: ops.setTypes(TextOps.isValid, BooleanType, { value: AnyType }),

  isEmpty: ops.setTypes(TextOps.isEmpty, BooleanType, { value: TextType }),

  isNotEmpty: ops.setTypes(TextOps.isNotEmpty, BooleanType, { value: TextType }),

  isEqual: ops.setTypes(TextOps.isEqual, BooleanType, { a: TextType, b: TextType }, { ignoreCase: BooleanType }),

  isNotEqual: ops.setTypes(TextOps.isNotEqual, BooleanType, { a: TextType, b: TextType }, { ignoreCase: BooleanType }),

  isLess: ops.setTypes(TextOps.isLess, BooleanType, { value: TextType, test: TextType }, { ignoreCase: BooleanType }),

  isLessOrEqual: ops.setTypes(TextOps.isLessOrEqual, BooleanType, { value: TextType, test: TextType }, { ignoreCase: BooleanType }),

  isGreater: ops.setTypes(TextOps.isGreater, BooleanType, { value: TextType, test: TextType }, { ignoreCase: BooleanType }),

  isGreaterOrEqual: ops.setTypes(TextOps.isGreaterOrEqual, BooleanType, { value: TextType, test: TextType }, { ignoreCase: BooleanType }),

  isLower: ops.setTypes(TextOps.isLower, BooleanType, { value: TextType }),

  isUpper: ops.setTypes(TextOps.isUpper, BooleanType, { value: TextType }),

  isUuid: ops.setTypes(TextOps.isUuid, BooleanType, { value: TextType }),

  // Casts

  asAny: ops.setTypes(TextOps.asAny, AnyType, { value: TextType }),

  asBoolean: ops.setTypes(TextOps.asBoolean, BooleanType, { value: TextType }),

  asColor: ops.setTypes(TextOps.asColor, ColorType, { value: TextType }),

  asDate: ops.setTypes(TextOps.asDate, DateType, { value: TextType }),

  asList: ops.setTypes(TextOps.asList, i => ListType.forItem(i.value || TextType), { value: TextType }),

  asMap: ops.setTypes(TextOps.asMap, i => MapType.forItem(i.value || TextType), { value: TextType }),

  asNumber: ops.setTypes(TextOps.asNumber, NumberType, { value: TextType }),

  asObject: ops.setTypes(TextOps.asObject, ObjectType, { value: TextType }),

  asText: ops.setTypes(TextOps.asText, i => i.value || TextType, { value: TextType }),

  asTuple: ops.setTypes(TextOps.asTuple, i => TupleType.forItem([i.value || TextType]), { value: TextType }),

  asSet: ops.setTypes(TextOps.asSet, i => SetType.forItem(i.value || TextType), { value: TextType }),

};
