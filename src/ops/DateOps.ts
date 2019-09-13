
import { AnyType } from '../types/Any';
import { BooleanType } from '../types/Boolean';
import { DateType } from '../types/Date';
import { ListType } from '../types/List';
import { MapType } from '../types/Map';
import { NumberType } from '../types/Number';
import { ObjectType } from '../types/Object';
import { TextType } from '../types/Text';
import { TupleType } from '../types/Tuple';


const ops = DateType.operations;

export const DateOps = 
{

  // Static

  create: ops.set('create'),

  now: ops.set('now'),

  today: ops.set('today'),

  tomorrow: ops.set('today+'),

  yesterday: ops.set('today-'),

  // Operations

  parse: ops.set('parse', {}, ['value'], ['parseAsUTC']),

  fromText: ops.set('>txt', {}, ['value'], ['parseAsUTC']),

  fromTimestamp: ops.set('>tms', {}, ['value']),

  fromTimestampSeconds: ops.set('>tmss', {}, ['value']),

  min: ops.set('min', {}, ['value', 'test']),

  max: ops.set('max', {}, ['value', 'test']),

  get: ops.set('get', {}, ['value', 'property']),

  set: ops.set('set', {}, ['value', 'property', 'set']),

  add: ops.set('+', {}, ['value', 'unit'], ['amount']),

  sub: ops.set('-', {}, ['value', 'unit'], ['amount']),

  startOf: ops.set('startOf', {}, ['value', 'unit']),

  endOf: ops.set('endOf', {}, ['value', 'unit'], ['inclusive']),

  daysInMonth: ops.set('dim', {}, ['value']),

  daysInYear: ops.set('diy', {}, ['value']),

  weeksInYear: ops.set('wiy', {}, ['value']),

  copy: ops.set('copy', {}, ['value']),

  cmp: ops.set('cmp', {}, ['value', 'test'], ['unit']),

  diff: ops.set('diff', {}, ['value', 'test'], ['unit', 'absolute', 'adjust']),

  timezoneOffset: ops.set('offset', {}, ['value']),

  // Formatters

  toText: ops.set('toText', {}, ['value', 'format']),

  toISOText: ops.set('toISOText', {}, ['value']),

  // Comparisons
 
  isEqual: ops.set('=', {}, ['value', 'test'], ['unit']),

  isBefore: ops.set('<', {}, ['value', 'test'], ['unit']),

  isBeforeOrEqual: ops.set('<=', {}, ['value', 'test'], ['unit']),

  isAfter: ops.set('>', {}, ['value', 'test'], ['unit']),

  isAfterOrEqual: ops.set('>=', {}, ['value', 'test'], ['unit']),

  isBetween: ops.set('between', {}, ['value', 'start', 'end'], ['unit', 'startInclusive', 'endInclusive']),

  isStartOf: ops.set('startOf?', {}, ['value', 'unit']),

  isEndOf: ops.set('endOf?', {}, ['value', 'unit'], ['inclusive']),

  isDST: ops.set('dst?', {}, ['value']),

  isLeapYear: ops.set('leap?', {}, ['value']),

  // Casts

  asAny: ops.set('~' + AnyType.id, {}, ['value']),

  asBoolean: ops.set('~' + BooleanType.id, {}, ['value']),

  asDate: ops.set('~' + DateType.id, {}, ['value']),

  asList: ops.set('~' + ListType.id, {}, ['value']),

  asMap: ops.set('~' + MapType.id, {}, ['value']),

  asNumber: ops.set('~' + NumberType.id, {}, ['value']),

  asObject: ops.set('~' + ObjectType.id, {}, ['value']),

  asText: ops.set('~' + TextType.id, {}, ['value']),

  asTuple: ops.set('~' + TupleType.id, {}, ['value']),

};