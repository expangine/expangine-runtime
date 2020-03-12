
import { Operations } from '../Operation';
import { ID } from '../types/ID';
import { Computeds } from '../Computed';


export const DateOperations = new Operations(ID.Date + ID.Delimiter);

export const DateComputeds = new Computeds(ID.Date + ID.Delimiter);

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

  asSet: ops.set('~' + ID.Set, {}, ['value']),

};

DateComputeds.set('timestamp', DateOps.get, 'value', { property: 'timestamp' });
DateComputeds.setWritable('timestamp', DateOps.set, 'value', 'set', { property: 'timestamp' });

DateComputeds.set('timestampSeconds', DateOps.get, 'value', { property: 'timestampSeconds' });
DateComputeds.setWritable('timestampSeconds', DateOps.set, 'value', 'set', { property: 'timestampSeconds' });

DateComputeds.set('millis', DateOps.get, 'value', { property: 'millis' });
DateComputeds.setWritable('millis', DateOps.set, 'value', 'set', { property: 'millis' });

DateComputeds.set('second', DateOps.get, 'value', { property: 'second' });
DateComputeds.setWritable('second', DateOps.set, 'value', 'set', { property: 'second' });

DateComputeds.set('minute', DateOps.get, 'value', { property: 'minute' });
DateComputeds.setWritable('minute', DateOps.set, 'value', 'set', { property: 'minute' });

DateComputeds.set('hour', DateOps.get, 'value', { property: 'hour' });
DateComputeds.setWritable('hour', DateOps.set, 'value', 'set', { property: 'hour' });

DateComputeds.set('day', DateOps.get, 'value', { property: 'day' });
DateComputeds.setWritable('day', DateOps.set, 'value', 'set', { property: 'day' });

DateComputeds.set('dayOfMonth', DateOps.get, 'value', { property: 'dayOfMonth' });
DateComputeds.setWritable('dayOfMonth', DateOps.set, 'value', 'set', { property: 'dayOfMonth' });

DateComputeds.set('lastDayOfMonth', DateOps.get, 'value', { property: 'lastDayOfMonth' });
DateComputeds.setWritable('lastDayOfMonth', DateOps.set, 'value', 'set', { property: 'lastDayOfMonth' });

DateComputeds.set('dayOfYear', DateOps.get, 'value', { property: 'dayOfYear' });
DateComputeds.setWritable('dayOfYear', DateOps.set, 'value', 'set', { property: 'dayOfYear' });

DateComputeds.set('dayOfWeek', DateOps.get, 'value', { property: 'dayOfWeek' });
DateComputeds.setWritable('dayOfWeek', DateOps.set, 'value', 'set', { property: 'dayOfWeek' });

DateComputeds.set('week', DateOps.get, 'value', { property: 'week' });
DateComputeds.setWritable('week', DateOps.set, 'value', 'set', { property: 'week' });

DateComputeds.set('weekOfMonth', DateOps.get, 'value', { property: 'weekOfMonth' });
DateComputeds.setWritable('weekOfMonth', DateOps.set, 'value', 'set', { property: 'weekOfMonth' });

DateComputeds.set('weekspanOfMonth', DateOps.get, 'value', { property: 'weekspanOfMonth' });
DateComputeds.setWritable('weekspanOfMonth', DateOps.set, 'value', 'set', { property: 'weekspanOfMonth' });

DateComputeds.set('fullWeekOfMonth', DateOps.get, 'value', { property: 'fullWeekOfMonth' });
DateComputeds.setWritable('fullWeekOfMonth', DateOps.set, 'value', 'set', { property: 'fullWeekOfMonth' });

DateComputeds.set('lastWeekspanOfMonth', DateOps.get, 'value', { property: 'lastWeekspanOfMonth' });
DateComputeds.setWritable('lastWeekspanOfMonth', DateOps.set, 'value', 'set', { property: 'lastWeekspanOfMonth' });

DateComputeds.set('lastFullWeekOfMonth', DateOps.get, 'value', { property: 'lastFullWeekOfMonth' });
DateComputeds.setWritable('lastFullWeekOfMonth', DateOps.set, 'value', 'set', { property: 'lastFullWeekOfMonth' });

DateComputeds.set('weekOfYear', DateOps.get, 'value', { property: 'weekOfYear' });
DateComputeds.setWritable('weekOfYear', DateOps.set, 'value', 'set', { property: 'weekOfYear' });

DateComputeds.set('weekspanOfYear', DateOps.get, 'value', { property: 'weekspanOfYear' });
DateComputeds.setWritable('weekspanOfYear', DateOps.set, 'value', 'set', { property: 'weekspanOfYear' });

DateComputeds.set('fullWeekOfYear', DateOps.get, 'value', { property: 'fullWeekOfYear' });
DateComputeds.setWritable('fullWeekOfYear', DateOps.set, 'value', 'set', { property: 'fullWeekOfYear' });

DateComputeds.set('lastWeekspanOfYear', DateOps.get, 'value', { property: 'lastWeekspanOfYear' });
DateComputeds.setWritable('lastWeekspanOfYear', DateOps.set, 'value', 'set', { property: 'lastWeekspanOfYear' });

DateComputeds.set('lastFullWeekOfYear', DateOps.get, 'value', { property: 'lastFullWeekOfYear' });
DateComputeds.setWritable('lastFullWeekOfYear', DateOps.set, 'value', 'set', { property: 'lastFullWeekOfYear' });

DateComputeds.set('month', DateOps.get, 'value', { property: 'month' });
DateComputeds.setWritable('month', DateOps.set, 'value', 'set', { property: 'month' });

DateComputeds.set('quarter', DateOps.get, 'value', { property: 'quarter' });
DateComputeds.setWritable('quarter', DateOps.set, 'value', 'set', { property: 'quarter' });

DateComputeds.set('year', DateOps.get, 'value', { property: 'year' });
DateComputeds.setWritable('year', DateOps.set, 'value', 'set', { property: 'year' });

DateComputeds.set('timeIdentifier', DateOps.get, 'value', { property: 'timeIdentifier' });
DateComputeds.setWritable('timeIdentifier', DateOps.set, 'value', 'set', { property: 'timeIdentifier' });

DateComputeds.set('dayIdentifier', DateOps.get, 'value', { property: 'dayIdentifier' });
DateComputeds.setWritable('dayIdentifier', DateOps.set, 'value', 'set', { property: 'dayIdentifier' });

DateComputeds.set('weekIdentifier', DateOps.get, 'value', { property: 'weekIdentifier' });
DateComputeds.setWritable('weekIdentifier', DateOps.set, 'value', 'set', { property: 'weekIdentifier' });

DateComputeds.set('monthIdentifier', DateOps.get, 'value', { property: 'monthIdentifier' });
DateComputeds.setWritable('monthIdentifier', DateOps.set, 'value', 'set', { property: 'monthIdentifier' });

DateComputeds.set('quarterIdentifier', DateOps.get, 'value', { property: 'quarterIdentifier' });
DateComputeds.setWritable('quarterIdentifier', DateOps.set, 'value', 'set', { property: 'quarterIdentifier' });


DateComputeds.set('startOfSecond', DateOps.startOf, 'value', { unit: 'second' });
DateComputeds.set('startOfMinute', DateOps.startOf, 'value', { unit: 'minute' });
DateComputeds.set('startOfHour', DateOps.startOf, 'value', { unit: 'hour' });
DateComputeds.set('startOfDay', DateOps.startOf, 'value', { unit: 'day' });
DateComputeds.set('startOfWeek', DateOps.startOf, 'value', { unit: 'week' });
DateComputeds.set('startOfMonth', DateOps.startOf, 'value', { unit: 'month' });
DateComputeds.set('startOfQuarter', DateOps.startOf, 'value', { unit: 'quarter' });
DateComputeds.set('startOfYear', DateOps.startOf, 'value', { unit: 'year' });

DateComputeds.set('endOfSecond', DateOps.endOf, 'value', { unit: 'second' });
DateComputeds.set('endOfMinute', DateOps.endOf, 'value', { unit: 'minute' });
DateComputeds.set('endOfHour', DateOps.endOf, 'value', { unit: 'hour' });
DateComputeds.set('endOfDay', DateOps.endOf, 'value', { unit: 'day' });
DateComputeds.set('endOfWeek', DateOps.endOf, 'value', { unit: 'week' });
DateComputeds.set('endOfMonth', DateOps.endOf, 'value', { unit: 'month' });
DateComputeds.set('endOfQuarter', DateOps.endOf, 'value', { unit: 'quarter' });
DateComputeds.set('endOfYear', DateOps.endOf, 'value', { unit: 'year' });

DateComputeds.set('daysInMonth', DateOps.daysInMonth);
DateComputeds.set('daysInYear', DateOps.daysInYear);
DateComputeds.set('weeksInYear', DateOps.weeksInYear);
DateComputeds.set('timezoneOffset', DateOps.timezoneOffset);
DateComputeds.set('toISOText', DateOps.toISOText);
DateComputeds.set('isDST', DateOps.isDST);
DateComputeds.set('isLeapYear', DateOps.isLeapYear);
