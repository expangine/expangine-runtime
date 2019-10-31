import { AnyType } from '../../types/Any';
import { NumberType } from '../../types/Number';
import { BooleanType } from '../../types/Boolean';
import { DateType } from '../../types/Date';
import { ListType } from '../../types/List';
import { MapType } from '../../types/Map';
import { ObjectType } from '../../types/Object';
import { TextType } from '../../types/Text';
import { TupleType } from '../../types/Tuple';
import { EnumType } from '../../types/Enum';
import { ManyType } from '../../types/Many';

import { DateOps } from '../DateOps';
import { OptionalType } from '../../types/Optional';
import { ColorType } from '../../types/Color';


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
    ['Day Identifier', 'dayIdentifier'],
    ['Week Identifier', 'weekIdentifier'],
    ['Month Identifier', 'monthIdentifier'],
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


export const DateOpsTypes = 
{

  // Static

  create: ops.setTypes(DateOps.create, DateType),

  now: ops.setTypes(DateOps.now, DateType),

  today: ops.setTypes(DateOps.today, DateType),

  tomorrow: ops.setTypes(DateOps.tomorrow, DateType),

  yesterday: ops.setTypes(DateOps.yesterday, DateType),

  // Operations

  maybe: ops.setTypes(DateOps.maybe, 
    (i, defs) => defs.maybeType(i.value, BooleanType),
    { value: AnyType } 
  ),

  parse: ops.setTypes(DateOps.parse, OptionalType.for(DateType), { value: new ManyType([DateType.baseType, NumberType.baseType, TextType.baseType]) }, { parseAsUTC: BooleanType }),

  fromText: ops.setTypes(DateOps.fromText, OptionalType.for(DateType), { value: TextType }, { parseAsUTC: BooleanType }),

  fromTimestamp: ops.setTypes(DateOps.fromTimestamp, DateType, { value: NumberType }),

  fromTimestampSeconds: ops.setTypes(DateOps.fromTimestampSeconds, DateType, { value: NumberType }),

  min: ops.setTypes(DateOps.min, DateType, { value: DateType, test: DateType }),

  max: ops.setTypes(DateOps.max, DateType, { value: DateType, test: DateType }),

  get: ops.setTypes(DateOps.get, NumberType, { value: DateType, property: DateProperty }),

  set: ops.setTypes(DateOps.set, DateType, { value: DateType, property: DateProperty, set: NumberType }),

  add: ops.setTypes(DateOps.add, DateType, { value: DateType, unit: DateUnits }, { amount: NumberType }),

  sub: ops.setTypes(DateOps.sub, DateType, { value: DateType, unit: DateUnits }, { amount: NumberType }),

  startOf: ops.setTypes(DateOps.startOf, DateType, { value: DateType, unit: DateUnits }),

  endOf: ops.setTypes(DateOps.endOf, DateType, { value: DateType, unit: DateUnits }, { inclusive: BooleanType }),

  daysInMonth: ops.setTypes(DateOps.daysInMonth, NumberType, { value: DateType }),

  daysInYear: ops.setTypes(DateOps.daysInYear, NumberType, { value: DateType }),

  weeksInYear: ops.setTypes(DateOps.weeksInYear, NumberType, { value: DateType }),

  copy: ops.setTypes(DateOps.copy, DateType, { value: DateType }),

  cmp: ops.setTypes(DateOps.cmp, NumberType, { value: DateType, test: DateType }, { unit: DateUnits }),

  diff: ops.setTypes(DateOps.diff, NumberType, { value: DateType, test: DateType }, { unit: DateUnits, absolute: BooleanType, adjust: DateAdjust }),

  timezoneOffset: ops.setTypes(DateOps.timezoneOffset, NumberType, { value: DateType }),

  // Formatters

  toText: ops.setTypes(DateOps.toText, TextType, { value: DateType, format: TextType }),

  toISOText: ops.setTypes(DateOps.toISOText, TextType, { value: DateType }),

  // Comparisons

  isValid: ops.setTypes(DateOps.isValid, BooleanType, { value: AnyType }),
 
  isEqual: ops.setTypes(DateOps.isEqual, BooleanType, { value: DateType, test: DateType }, { unit: DateUnits }),

  isBefore: ops.setTypes(DateOps.isBefore, BooleanType, { value: DateType, test: DateType }, { unit: DateUnits }),

  isBeforeOrEqual: ops.setTypes(DateOps.isBeforeOrEqual, BooleanType, { value: DateType, test: DateType }, { unit: DateUnits }),

  isAfter: ops.setTypes(DateOps.isAfter, BooleanType, { value: DateType, test: DateType }, { unit: DateUnits }),

  isAfterOrEqual: ops.setTypes(DateOps.isAfterOrEqual, BooleanType, { value: DateType, test: DateType }, { unit: DateUnits }),

  isBetween: ops.setTypes(DateOps.isBetween, BooleanType, { value: DateType, start: DateType, end: DateType }, { unit: DateUnits, startInclusive: BooleanType, endInclusive: BooleanType }),

  isStartOf: ops.setTypes(DateOps.isStartOf, BooleanType, { value: DateType, unit: DateUnits }),

  isEndOf: ops.setTypes(DateOps.isEndOf, BooleanType, { value: DateType, unit: DateUnits }, { inclusive: BooleanType }),

  isDST: ops.setTypes(DateOps.isDST, BooleanType, { value: DateType }),

  isLeapYear: ops.setTypes(DateOps.isLeapYear, BooleanType, { value: DateType }),

  // Casts

  asAny: ops.setTypes(DateOps.asAny, AnyType, { value: DateType }),

  asBoolean: ops.setTypes(DateOps.asBoolean, BooleanType, { value: DateType }),

  asColor: ops.setTypes(DateOps.asColor, ColorType, { value: DateType }),

  asDate: ops.setTypes(DateOps.asDate, i => i.value || DateType, { value: DateType }),

  asList: ops.setTypes(DateOps.asList, i => ListType.forItem(i.value || DateType), { value: DateType }),

  asMap: ops.setTypes(DateOps.asMap, i => MapType.forItem(i.value || DateType), { value: DateType }),

  asNumber: ops.setTypes(DateOps.asNumber, NumberType, { value: DateType }),

  asObject: ops.setTypes(DateOps.asObject, ObjectType, { value: DateType }),

  asText: ops.setTypes(DateOps.asText, TextType, { value: DateType }),

  asTuple: ops.setTypes(DateOps.asTuple, i => TupleType.forItem([i.value || DateType]), { value: DateType }),

};