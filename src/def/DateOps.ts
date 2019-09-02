import { DateType } from '../types/Date';
import { BooleanType } from '../types/Boolean';
import { ManyType } from '../types/Many';
import { NumberType } from '../types/Number';
import { TextType } from '../types/Text';
import { EnumType } from '../types/Enum';


const ops = DateType.operations;

const DateProperty = new EnumType({
  key: TextType.baseType.newInstance(), 
  value: TextType.baseType.newInstance(),
  constants: new Map([
    ['Timestamp', 'timestamp'],
    ['Timestamp (seconds)', 'timestampSeconds'],
    ['Millisecond', 'millis'],
    ['Second', 'second'],
    ['Minute', 'minute'],
    ['Hour', 'hour'],
    ['Day', 'day'],
    ['Day of Month', 'dayOfMonth'],
    ['Last Day of Month', 'lastDayOfMonth'],
    ['Day of Year', 'dayOfYear'],
    ['Day of Week', 'dayOfWeek'],
    ['Week', 'week'],
    ['Week of Month', 'weekOfMonth'],
    ['Weekspan of Month', 'weekspanOfMonth'],
    ['Full Week of Month', 'fullWeekOfMonth'],
    ['Last Weekspan of Month', 'lastWeekspanOfMonth'],
    ['Last Full Week of Month', 'lastFullWeekOfMonth'],
    ['Week of Year', 'weekOfYear'],
    ['Weekspan of Year', 'weekspanOfYear'],
    ['Full Week of Year', 'fullWeekOfYear'],
    ['Last Weekspan of Year', 'lastWeekspanOfYear'],
    ['Last Full Week of Year', 'lastFullWeekOfYear'],
    ['Month', 'month'],
    ['Quarter', 'quarter'],
    ['Year', 'year'],
    ['Time Identifier', 'timeIdentifier'],
    ['DayIdentifier', 'dayIdentifier'],
    ['WeekIdentifier', 'weekIdentifier'],
    ['MonthIdentifier', 'monthIdentifier'],
    ['Quarter Identifier', 'quarterIdentifier']
  ])
});

const DateUnits = new EnumType({
  key: TextType.baseType.newInstance(), 
  value: TextType.baseType.newInstance(),
  constants: new Map([
    ['Millisecond', 'millis'],
    ['Second', 'second'],
    ['Minute', 'minute'],
    ['Hour', 'hour'],
    ['Day', 'day'],
    ['Week', 'week'],
    ['Month', 'month'],
    ['Quarter', 'quarter'],
    ['Year', 'year']
  ])
});

const DateAdjust = new EnumType({
  key: TextType.baseType.newInstance(),
  value: TextType.baseType.newInstance(),
  constants: new Map([
    ['None', 'none'],
    ['Floor', 'floor'],
    ['Ceil', 'ceil'],
    ['Round', 'round'],
    ['Truncate', 'truncate'],
    ['Up', 'up'],
    ['Down', 'down']
  ])
})


export const DateOps = 
{

  // Static

  create: ops.set('create', {}, DateType),

  now: ops.set('now', {}, DateType),

  today: ops.set('today', {}, DateType),

  tomorrow: ops.set('today+', {}, DateType),

  yesterday: ops.set('today-', {}, DateType),

  // Operations

  parse: ops.set('parse', {}, DateType, { value: new ManyType([DateType.baseType, NumberType.baseType, TextType.baseType]) }, { parseAsUTC: BooleanType }),

  fromText: ops.set('>text', {}, DateType, { value: TextType }),

  fromTimestamp: ops.set('>tms', {}, DateType, { value: NumberType }),

  fromTimestampSeconds: ops.set('>tmss', {}, DateType, { value: NumberType }),

  min: ops.set('min', {}, DateType, { value: DateType, test: DateType }),

  max: ops.set('max', {}, DateType, { value: DateType, test: DateType }),

  get: ops.set('get', {}, NumberType, { value: DateType, property: DateProperty }),

  set: ops.set('set', {}, DateType, { value: DateType, property: DateProperty, set: NumberType }),

  add: ops.set('+', {}, DateType, { value: DateType, unit: DateUnits }, { amount: NumberType }),

  sub: ops.set('-', {}, DateType, { value: DateType, unit: DateUnits }, { amount: NumberType }),

  startOf: ops.set('startOf', {}, DateType, { value: DateType, unit: DateUnits }),

  endOf: ops.set('endOf', {}, DateType, { value: DateType, unit: DateUnits }, { inclusive: BooleanType }),

  daysInMonth: ops.set('dim', {}, NumberType, { value: DateType }),

  daysInYear: ops.set('diy', {}, NumberType, { value: DateType }),

  weeksInYear: ops.set('wiy', {}, NumberType, { value: DateType }),

  copy: ops.set('copy', {}, DateType, { value: DateType }),

  cmp: ops.set('cmp', {}, NumberType, { value: DateType, test: DateType }, { unit: DateUnits }),

  diff: ops.set('diff', {}, NumberType, { value: DateType, test: DateType }, { unit: DateUnits, absolute: BooleanType, adjust: DateAdjust }),

  timezoneOffset: ops.set('offset', {}, NumberType, { value: DateType }),

  // Formatters

  toText: ops.set('toText', {}, TextType, { value: DateType, format: TextType }),

  toISOText: ops.set('toISOText', {}, TextType, { value: DateType }),

  // Comparisons
 
  isEqual: ops.set('=', {}, BooleanType, { value: DateType, test: DateType }, { unit: DateUnits }),

  isBefore: ops.set('<', {}, BooleanType, { value: DateType, test: DateType }, { unit: DateUnits }),

  isBeforeOrEqual: ops.set('<=', {}, BooleanType, { value: DateType, test: DateType }, { unit: DateUnits }),

  isAfter: ops.set('>', {}, BooleanType, { value: DateType, test: DateType }, { unit: DateUnits }),

  isAfterOrEqual: ops.set('>=', {}, BooleanType, { value: DateType, test: DateType }, { unit: DateUnits }),

  isBetween: ops.set('between', {}, BooleanType, { value: DateType, start: DateType, end: DateType }, { unit: DateUnits, startInclusive: BooleanType, endInclusive: BooleanType }),

  isStartOf: ops.set('startOf?', {}, BooleanType, { value: DateType, unit: DateUnits }),

  isEndOf: ops.set('endOf?', {}, BooleanType, { value: DateType, unit: DateUnits }, { inclusive: BooleanType }),

  isDST: ops.set('dst?', {}, BooleanType, { value: DateType }),

  isLeapYear: ops.set('leap?', {}, BooleanType, { value: DateType }),

};