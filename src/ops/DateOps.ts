
import { Operations } from '../Operation';
import { ID } from '../types/ID';


export const DateOperations = new Operations(ID.Date + ':');

const ops = DateOperations;

export const DateOps = 
{

  // Static

  create: ops.set('create'),

  now: ops.set('now'),

  today: ops.set('today'),

  tomorrow: ops.set('today+'),

  yesterday: ops.set('today-'),

  // Operations

  maybe: ops.set('maybe', {}, ['value']),

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

  isValid: ops.set('?', {}, ['value']),
 
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

  asAny: ops.set('~' + ID.Any, {}, ['value']),

  asBoolean: ops.set('~' + ID.Boolean, {}, ['value']),

  asColor: ops.set('~' + ID.Color, {}, ['value']),

  asDate: ops.set('~' + ID.Date, {}, ['value']),

  asList: ops.set('~' + ID.List, {}, ['value']),

  asMap: ops.set('~' + ID.Map, {}, ['value']),

  asNumber: ops.set('~' + ID.Number, {}, ['value']),

  asObject: ops.set('~' + ID.Object, {}, ['value']),

  asText: ops.set('~' + ID.Text, {}, ['value']),

  asTuple: ops.set('~' + ID.Tuple, {}, ['value']),

};