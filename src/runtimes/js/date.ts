
import { Runtime } from '../../Runtime';
import { DateOps } from '../../def/DateOps';
import { _number, _date, _text, _bool } from './helper';
import { padNumber } from '../../fns';
import { Format } from '../../util/Format';
import { DateType } from '../../types/Date';


// tslint:disable: no-magic-numbers


export default (run: Runtime) =>
{

  // Operations

  run.setOperation(DateOps.now, (params) => (context) =>
    new Date()
  ),

  run.setOperation(DateOps.today, (params) => (context) =>
    startOf.day(new Date())
  );

  run.setOperation(DateOps.tomorrow, (params) => (context) =>
    mutate(mutate(new Date(), startOf.day), d => add.day(d, +1))
  );

  run.setOperation(DateOps.yesterday, (params) => (context) =>
    mutate(mutate(new Date(), startOf.day), d => add.day(d, -1))
  );

  run.setOperation(DateOps.parse, (params) => (context) => 
    _bool(params.parseAsUTC, context, false)
      ? new DateType({ parseAsUTC: true }).normalize(params.value(context))
      : DateType.baseType.normalize(params.value(context))
  );

  run.setOperation(DateOps.fromText, (params) => (context) => 
    DateType.baseType.normalize(_text(params.value, context))
  );

  run.setOperation(DateOps.fromTimestamp, (params) => (context) => 
    new Date(_number(params.value, context, Date.now()))
  );

  run.setOperation(DateOps.fromTimestampSeconds, (params) => (context) => 
    new Date(_number(params.value, context, Date.now() / 1000) * 1000)
  );

  run.setOperation(DateOps.min, (params) => (context) => {
    const value = _date(params.value, context);
    const test = _date(params.test, context);

    return value.valueOf() < test.valueOf() ? value : test;
  });

  run.setOperation(DateOps.max, (params) => (context) => {
    const value = _date(params.value, context);
    const test = _date(params.test, context);

    return value.valueOf() > test.valueOf() ? value : test;
  });

  run.setOperation(DateOps.get, (params) => (context) => {
    const value = _date(params.value, context);
    const prop = _text(params.property, context, 'timestamp');
    
    return prop in getters ? getters[prop](value) : -1;
  });

  run.setOperation(DateOps.set, (params) => (context) => {
    const value = _date(params.value, context);
    const prop = _text(params.property, context, 'timestamp');
    const update = _number(params.set, context, 0);

    return prop in setters ? setters[prop](value, update) : value;
  });

  run.setOperation(DateOps.add, (params) => (context) => {
    const value = _date(params.value, context);
    const unit = _text(params.unit, context, 'millis');
    const amount = _number(params.amount, context, 0);

    return unit in add ? add[unit](value, amount) : value;
  });

  run.setOperation(DateOps.sub, (params) => (context) => {
    const value = _date(params.value, context);
    const unit = _text(params.unit, context, 'millis');
    const amount = _number(params.amount, context, 0);

    return unit in add ? add[unit](value, -amount) : value;
  });

  run.setOperation(DateOps.startOf, (params) => (context) => {
    const value = _date(params.value, context);
    const unit = _text(params.unit, context, 'day');

    return unit in startOf ? mutate(value, startOf[unit]) : value;
  });

  run.setOperation(DateOps.endOf, (params) => (context) => {
    const value = _date(params.value, context);
    const unit = _text(params.unit, context, 'day');

    return unit in endOf ? mutate(value, endOf[unit]) : value;
  });

  run.setOperation(DateOps.daysInMonth, (params) => (context) => 
    getDaysInMonth(_date(params.value, context))
  );

  run.setOperation(DateOps.daysInYear, (params) => (context) => 
    getDaysInYear(_date(params.value, context))
  );

  run.setOperation(DateOps.weeksInYear, (params) => (context) => 
    getWeeksInYear(_date(params.value, context))
  );

  run.setOperation(DateOps.copy, (params) => (context) =>
    new Date(_date(params.value, context).getTime())
  );

  run.setOperation(DateOps.cmp, (params) => (context) => {
    const value = _date(params.value, context);
    const test = _date(params.test, context);
    const unit = _text(params.unit, context, 'millis') as Unit;

    return unit in startOf ? compare(value, test, unit) : 0;
  });

  run.setOperation(DateOps.diff, (params) => (context) => {
    const value = _date(params.value, context);
    const test = _date(params.test, context);
    const unit = _text(params.unit, context, 'millis');
    const absolute = _bool(params.absolute, context, true);
    const adjust = _text(params.adjust, context, 'down');

    if (!(unit in diff) || !(adjust in adjusters))
    {
      return Number.NaN;
    }

    const amount = adjusters[adjust]( diff[unit](value, test) );

    return absolute ? Math.abs(amount) : amount;
  });

  run.setOperation(DateOps.timezoneOffset, (params) => (context) => 
    getDateOffset(_date(params.value, context))
  );

  run.setOperation(DateOps.toText, (params) => (context) =>
    DayFormat.format(_text(params.format, context), [_date(params.value, context), globalLocaleOptions])
  );

  run.setOperation(DateOps.toISOText, (params) => (context) => 
    _date(params.value, context).toISOString()
  );

  // Comparisons

  run.setOperation(DateOps.isEqual, (params, scope) => (context) =>
    run.getOperation(DateOps.cmp.id)(params, scope)(context) === 0
  );

  run.setOperation(DateOps.isBefore, (params, scope) => (context) =>
    run.getOperation(DateOps.cmp.id)(params, scope)(context) < 0
  );

  run.setOperation(DateOps.isBeforeOrEqual, (params, scope) => (context) =>
    run.getOperation(DateOps.cmp.id)(params, scope)(context) <= 0
  );

  run.setOperation(DateOps.isAfter, (params, scope) => (context) =>
    run.getOperation(DateOps.cmp.id)(params, scope)(context) > 0
  );

  run.setOperation(DateOps.isAfterOrEqual, (params, scope) => (context) =>
    run.getOperation(DateOps.cmp.id)(params, scope)(context) >= 0
  );

  run.setOperation(DateOps.isBetween, (params) => (context) => {
    const value = _date(params.value, context);
    const start = _date(params.start, context);
    const end = _date(params.end, context);
    const unit = _text(params.unit, context, 'millis') as Unit;
    const startInclusive = _bool(params.startInclusive, context, true);
    const endInclusive = _bool(params.endInclusive, context, false);

    const startCompare = compare(value, start, unit);
    const endCompare = compare(value, end, unit);
    
    const startOffset = startInclusive ? 0 : 1;
    const endOffset = endInclusive ? 0 : -1;

    return startCompare >= startOffset && endCompare <= endOffset;
  });

  run.setOperation(DateOps.isStartOf, (params) => (context) => {
    const value = _date(params.value, context);
    const unit = _text(params.unit, context, 'millis') as Unit;
    
    return unit in startOf
      ? mutate(value, startOf[unit]).getTime() === value.getTime()
      : false;
  });

  run.setOperation(DateOps.isEndOf, (params) => (context) => {
    const value = _date(params.value, context);
    const unit = _text(params.unit, context, 'millis') as Unit;
    
    return unit in endOf
      ? mutate(value, endOf[unit]).getTime() === value.getTime()
      : false;
  });

  run.setOperation(DateOps.isDST, (params) => (context) => 
    isDaylightSavingTime(_date(params.value, context))
  );

  run.setOperation(DateOps.isDST, (params) => (context) => 
    isLeapYear(_date(params.value, context))
  );

};


const MAP: string[] = [
  'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'
];

const globalLocaleOptions: LocaleOptions = {
  weekStartsOn: 0,
  firstWeekContainsDate: 4,
  am: 'am',
  pm: 'pm',
  formatLT: 'h:mm A',
  formatLTS: 'h:mm:ss A',
  formatL: 'MM/DD/Y',
  formatl: 'M/D/Y',
  formatLL: 'MMMM D, Y',
  formatll: 'MMM D, Y',
  formatLLL: 'MMMM D, Y h:mm A',
  formatlll: 'MMM D, Y h:mm A',
  formatLLLL: 'dddd, MMMM D, Y h:mm A',
  formatllll: 'ddd, MMM D, Y h:mm A',
  suffix: (value: number) => {
    const TH_SPECIAL_MIN = 11;
    const TH_SPECIAL_MAX = 13;
    const suffix = value >= TH_SPECIAL_MIN && value <= TH_SPECIAL_MAX ? 'th' : MAP[ value % MAP.length ];

    return value + suffix;
  },
  list: (items) => {
    const last: number = items.length - 1;
    let out: string = items[0];

    for (let i = 1; i < last; i++) {
      out += ', ' + items[i];
    }

    if (last > 0) {
      out += ' and ' + items[last];
    }

    return out;
  },
  months: [
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ['Ja', 'F', 'Mr', 'Ap', 'My', 'Je', 'Jl', 'Ag', 'S', 'O', 'N', 'D']
  ],
  weekdays: [
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'],
  ],
};


interface LocaleOptions
{

  /**
   * The first day of the week in the locale.
   */
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * The date which determines which day of January decides the first week of 
   * the year. If the first week of the year contains this date it will be the
   * 1st week of the year based on ISO standards. If the first week of the year
   * does not contain this date the weekOfYear will be 0.
   */
  firstWeekContainsDate: 1 | 2 | 3 | 4 | 5 | 6 | 7;

  suffix (value: number): string;

  am: string;
  pm: string;

  formatLT: string;
  formatLTS: string;
  formatL: string;
  formatl: string;
  formatLL: string;
  formatll: string;
  formatLLL: string;
  formatlll: string;
  formatLLLL: string;
  formatllll: string;

  list (items: string[]): string;

  months: [
    [string, string, string, string, string, string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string, string, string, string, string, string]
  ];

  weekdays: [
    [string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string]
  ];
}

/**
 * The number of milliseconds in a second.
 */
const MILLIS_IN_SECOND: number = 1000;

/**
 * The number of seconds in a minute.
 */
const SECONDS_IN_MINUTE: number = 60;

/**
 * The number of hours in a day (not including DST days).
 */
const HOURS_IN_DAY: number = 24;

/**
 * The number of days in a week.
 */
const DAYS_IN_WEEK: number = 7;

/**
 * The number of milliseconds in a minute.
 */
const MILLIS_IN_MINUTE: number = MILLIS_IN_SECOND * SECONDS_IN_MINUTE;

/**
 * The number of milliseconds in an hour.
 */
const MILLIS_IN_HOUR: number = MILLIS_IN_MINUTE * SECONDS_IN_MINUTE;

/**
 * The number of milliseconds in a day (not including DST days).
 */
const MILLIS_IN_DAY: number = MILLIS_IN_HOUR * HOURS_IN_DAY;

/**
 * The number of months in a quarter.
 */
const MONTHS_IN_QUARTER = 3;

/**
 * The number of months in a year.
 */
const MONTHS_IN_YEAR: number = 12;

/**
 * The first day of a month.
 */
const DAY_MIN: number = 1;

/**
 * The last day of the longest month.
 */
const DAY_MAX: number = 31;

/**
 * The last hour of the day.
 */
const HOUR_MAX: number = 23;

/**
 * The last minute of the hour.
 */
const MINUTE_MAX: number = 59;

/**
 * The last second of the minute.
 */
const SECOND_MAX: number = 59;

/**
 * The last millisecond of the second.
 */
const MILLIS_MAX: number = 999;

/**
 * The last day of the week.
 */
const WEEKDAY_MAX: number = 6;


type Unit = 
  'millis' | 
  'second' | 
  'minute' | 
  'hour' | 
  'day' | 
  'week' | 
  'month' |
  'quarter' |
  'year';

type UnitRecord<T> = Record<Unit, T>;

type Adjuster = (value: number) => number;

const adjusters: Record<string, Adjuster> = 
{
  none:     (value) => value,
  floor:    (value) => Math.floor(value),
  ceil:     (value) => Math.ceil(value),
  round:    (value) => Math.round(value),
  truncate: (value) => value < 0 ? Math.ceil(value) : Math.floor(value),
  down:     (value) => value < 0 ? Math.ceil(value) : Math.floor(value),
  up:       (value) => value < 0 ? Math.floor(value) : Math.ceil(value),
};

type Getter = (x: Date) => number;

const getters: Record<string, Getter> = 
{
  timestamp:            d => d.valueOf(),
  timestampSeconds:     d => Math.floor(d.valueOf() / MILLIS_IN_SECOND),
  millis:               d => d.getMilliseconds(),
  second:               d => d.getSeconds(),
  minute:               d => d.getMinutes(),
  hour:                 d => d.getHours(),
  day:                  d => d.getDay(),
  dayOfMonth:           d => d.getDate(),
  lastDayOfMonth:       getLastDayOfMonth,
  dayOfYear:            getDayOfYear,
  dayOfWeek:            getDayOfWeek,
  week:                 getWeekOfYear,
  weekOfMonth:          getWeekOfMonthISO,
  weekspanOfMonth:      getWeekspanOfMonth,
  fullWeekOfMonth:      getFullWeekOfMonth,
  lastWeekspanOfMonth:  getLastWeekspanOfMonth,
  lastFullWeekOfMonth:  getLastFullWeekOfMonth,
  weekOfYear:           getWeekOfYearISO,
  weekspanOfYear:       getWeekspanOfYear,
  fullWeekOfYear:       getFullWeekOfYear,
  lastWeekspanOfYear:   getLastWeekspanOfYear,
  lastFullWeekOfYear:   getLastFullWeekOfYear,
  month:                d => d.getMonth(),
  quarter:              getQuarter,
  year:                 d => d.getFullYear(),
  timeIdentifier:       getTimeIdentifier,
  dayIdentifier:        getDayIdentifier,
  weekIdentifier:       getWeekIdentifier,
  monthIdentifier:      getMonthIdentifier,
  quarterIdentifier:    getQuarterIdentifier,
};

type Setter = (x: Date, value: number) => void;

const setters: Record<string, Setter> = 
{
  timestamp:            (d, v) => mutate(d, x => x.setTime(v)),
  timestampSeconds:     (d, v) => mutate(d, x => x.setTime(v * 1000)),
  millis:               (d, v) => mutate(d, x => x.setMilliseconds(v)),
  second:               (d, v) => mutate(d, x => x.setSeconds(v)),
  minute:               (d, v) => mutate(d, x => x.setMinutes(v)),
  hour:                 (d, v) => mutate(d, x => x.setHours(v)),
  day:                  (d, v) => mutate(d, x => add.day(x, v - x.getDay())),
  dayOfMonth:           (d, v) => mutate(d, x => x.setDate(v)),
  lastDayOfMonth:       (d, v) => mutate(d, x => add.day(x, v - getLastDayOfMonth(x))),
  dayOfYear:            (d, v) => mutate(d, x => add.day(x, v - getDayOfYear(x))),
  dayOfWeek:            (d, v) => mutate(d, x => add.day(x, v - getDayOfWeek(x))),
  week:                 (d, v) => mutate(d, x => add.week(x, v - getWeekOfYear(x))),
  weekOfMonth:          (d, v) => mutate(d, x => add.week(x, v - getWeekOfMonthISO(x))),
  weekspanOfMonth:      (d, v) => mutate(d, x => add.week(x, v - getWeekspanOfMonth(x))),
  fullWeekOfMonth:      (d, v) => mutate(d, x => add.week(x, v - getFullWeekOfMonth(x))),
  lastWeekspanOfMonth:  (d, v) => mutate(d, x => add.week(x, v - getLastWeekspanOfMonth(x))),
  lastFullWeekOfMonth:  (d, v) => mutate(d, x => add.week(x, v - getLastFullWeekOfMonth(x))),
  weekOfYear:           (d, v) => mutate(d, x => add.week(x, v - getWeekOfYearISO(x))),
  weekspanOfYear:       (d, v) => mutate(d, x => add.week(x, v - getWeekspanOfYear(x))),
  fullWeekOfYear:       (d, v) => mutate(d, x => add.week(x, v - getFullWeekOfYear(x))),
  lastWeekspanOfYear:   (d, v) => mutate(d, x => add.week(x, v - getLastWeekspanOfYear(x))),
  lastFullWeekOfYear:   (d, v) => mutate(d, x => add.week(x, v - getLastFullWeekOfYear(x))),
  month:                (d, v) => mutate(d, x => x.setMonth(v)),
  quarter:              (d, v) => mutate(d, x => add.quarter(x, v - getQuarter(x))),
  year:                 (d, v) => mutate(d, x => x.setFullYear(v)),
};

type Starter = (x: Date, options?: LocaleOptions) => void;

const startOf: UnitRecord<Starter> = 
{
  millis:   x => x,
  second:   startOfSecond,
  minute:   startOfMinute,
  hour:     startOfHour,
  day:      startOfDay,
  week:     startOfWeek,
  month:    startOfMonth,
  quarter:  startOfQuarter,
  year:     startOfYear,
};

type Ender = (x: Date, options?: LocaleOptions) => void;

const endOf: UnitRecord<Ender> = 
{
  millis:   x => x,
  second:   endOfSecond,
  minute:   endOfMinute,
  hour:     endOfHour,
  day:      endOfDay,
  week:     endOfWeek,
  month:    endOfMonth,
  quarter:  endOfQuarter,
  year:     endOfYear,
};

type Adder = (x: Date, amount: number) => void;

const add: UnitRecord<Adder> = 
{
  millis:   addMilliseconds,
  second:   addSeconds,
  minute:   addMinutes,
  hour:     addHours,
  day:      addDays,
  week:     addWeeks,
  month:    addMonths,
  quarter:  addQuarters,
  year:     addYears,
};

type Differ = (a: Date, b: Date) => number;

const diff: UnitRecord<Differ> = 
{
  millis:   diffMilliseconds,
  second:   diffSeconds,
  minute:   diffMinutes,
  hour:     diffHours,
  day:      diffDays,
  week:     diffWeeks,
  month:    diffMonths,
  quarter:  diffQuarters,
  year:     diffYears,
};

function mutate(a: Date, mutator: (a: Date, options?: LocaleOptions) => void, options?: LocaleOptions): Date
{
  const b = new Date(a.getTime());

  mutator(b, options);

  return b;
}

function compare(a: Date, b: Date, precision: Unit = 'millis', options: LocaleOptions = globalLocaleOptions): number
{
  const starter = startOf[precision];
  const x = mutate(a, starter, options);
  const y = mutate(b, starter, options);

  return x.getTime() - y.getTime();
}

function getTimeIdentifier(x: Date): number
{
  return x.getFullYear() * 100000000
       + (x.getMonth() + 1) * 1000000
       + x.getDate() * 10000
       + x.getHours() * 100
       + x.getMinutes();
}

function getDayIdentifier(x: Date): number
{
  return x.getFullYear() * 10000
       + (x.getMonth() + 1) * 100
       + x.getDate();
}

function getWeekIdentifier(x: Date): number
{
  return x.getFullYear() * 1000
       + getWeekOfYear(x);
}

function getMonthIdentifier(x: Date): number
{
  return x.getFullYear() * 100
       + (x.getMonth() + 1);
}

function getQuarterIdentifier(x: Date): number
{
  return x.getFullYear() * 10
       + getQuarter(x);
}

function getLastDayOfMonth(x: Date): number
{
  return getDaysInMonth(x) - x.getDate() + 1;
}

function getLastWeekspanOfYear(x: Date): number
{
  const fromEnd = getDaysInYear(x) - getDayOfYear(x);

  return Math.floor(fromEnd / DAYS_IN_WEEK);
}

function getWeekOfYearISO(x: Date, options: LocaleOptions = globalLocaleOptions): number
{
  return getWeekISO(mutate(x, startOfYear), getDayOfYear(x), options);
}

function getWeekOfYear(x: Date, options: LocaleOptions = globalLocaleOptions): number
{
  return getWeek(mutate(x, startOfYear), getDayOfYear(x), options);
}

function getWeekspanOfYear(x: Date): number
{
  return Math.floor((getDayOfYear(x) - 1) / DAYS_IN_WEEK);
}

function getFullWeekOfYear(x: Date, options: LocaleOptions = globalLocaleOptions): number
{
  return getFullWeekOf(mutate(x, startOfYear), getDaysInYear(x), options);
}

function getWeeksInYear(x: Date, options: LocaleOptions = globalLocaleOptions): number
{
  return getWeekOfYearISO(mutate(x, endOfYear), options) + 1;
}

function getLastFullWeekOfYear(x: Date, options: LocaleOptions = globalLocaleOptions): number
{
  const lastOfYear = mutate(x, endOfYear);
  const week = getWeekOfYearISO(x, options);
  const weekMax = getWeekOfYearISO(lastOfYear, options);
  const lastWeek = weekMax - week;

  return getDayOfWeek(lastOfYear, options) === WEEKDAY_MAX 
    ? lastWeek + 1
    : lastWeek;
}

function getWeekspanOfMonth(x: Date): number
{
  return Math.floor((x.getDate() - 1) / DAYS_IN_WEEK);
}

function getLastWeekspanOfMonth(x: Date): number
{
  const fromEnd = getDaysInMonth(x) - x.getDate();

  return Math.floor(fromEnd / DAYS_IN_WEEK);
}

function getFullWeekOfMonth(x: Date, options: LocaleOptions = globalLocaleOptions): number
{
  return getFullWeekOf(mutate(x, startOfMonth), x.getDate(), options);
}

function getLastFullWeekOfMonth(x: Date, options: LocaleOptions = globalLocaleOptions): number
{
  const fromEnd = getDaysInMonth(x) - x.getDate();
  const invertedDayOfWeek = WEEKDAY_MAX - getDayOfWeek(x, options);
  
  return Math.floor((fromEnd - invertedDayOfWeek + DAYS_IN_WEEK) / DAYS_IN_WEEK);
}

function getWeekOfMonthISO(x: Date, options: LocaleOptions = globalLocaleOptions): number
{
  return getWeekISO(mutate(x, startOfMonth), x.getDate(), options);
}

/*
function getWeekOfMonth(x: Date, options: LocaleOptions = globalLocaleOptions): number
{
  return getWeek(mutate(x, startOfMonth), x.getDate(), options);
}
*/

function getWeekISO(start: Date, dayOfStart: number, options: LocaleOptions = globalLocaleOptions): number
{
  const { firstWeekContainsDate } = options;
  const dayOfWeekFirst = getDayOfWeek(start, options);
  const hasWeekZero = DAYS_IN_WEEK - dayOfWeekFirst < firstWeekContainsDate;
  const offset = hasWeekZero
    ? dayOfWeekFirst - 1
    : dayOfWeekFirst - 1 + DAYS_IN_WEEK;

  return Math.floor((dayOfStart + offset) / DAYS_IN_WEEK);
}

function getWeek(start: Date, dayOfStart: number, options: LocaleOptions): number
{
  const dayOfWeekFirst = getDayOfWeek(start, options);
  const offset = dayOfWeekFirst - 1 + DAYS_IN_WEEK;

  return Math.floor((dayOfStart + offset) / DAYS_IN_WEEK);
}

function getFullWeekOf(start: Date, dayOfStart: number, options: LocaleOptions = globalLocaleOptions): number
{
  const dayOfWeekFirst = getDayOfWeek(start, options);
  const hasWeekZero = dayOfWeekFirst !== 0; // Sunday
  const offset = hasWeekZero
    ? dayOfWeekFirst - 1
    : dayOfWeekFirst - 1 + DAYS_IN_WEEK;

  return Math.floor((dayOfStart + offset) / DAYS_IN_WEEK);
}

function getDayOfWeek(x: Date, options: LocaleOptions = globalLocaleOptions): number
{
  const { weekStartsOn } = options;
  const day = x.getDay();

  return day < weekStartsOn 
    ? day - weekStartsOn + DAYS_IN_WEEK
    : day - weekStartsOn;
}

function getDayOfYear(a: Date): number
{
  return Math.round(diffDays(a, mutate(a, startOfYear))) + 1;
}

function getDateOffset(x: Date): number
{
  return -Math.round(x.getTimezoneOffset() / 15) * 15;
}

function isDaylightSavingTime(x: Date): boolean
{
  const offset = getDateOffset(x);

  return (
    offset > getDateOffset(mutate(x, d => d.setMonth(0))) ||
    offset > getDateOffset(mutate(x, d => d.setMonth(5)))
  );
}

function isLeapYear(x: Date): boolean
{
  const year = x.getFullYear();

  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

function getDaysInYear(x: Date): number
{
  return isLeapYear(x) ? 366 : 365;
}

const daysInMonth = [
  [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];

function getDaysInMonth(x: Date): number
{
  return daysInMonth[isLeapYear(x) ? 1 : 0][x.getMonth()];
}

function getAbsoluteTimestamp(a: Date): number
{
  return a.getTime() - getTimezoneOffsetInMilliseconds(a);
}

function getTimezoneOffsetInMilliseconds(a: Date): number
{
  const b = new Date(a.getTime());
  const offsetMinutes = b.getTimezoneOffset();

  b.setSeconds(0, 0);

  const offsetMilliseconds = b.getTime() % MILLIS_IN_MINUTE;

  return offsetMinutes * MILLIS_IN_MINUTE + offsetMilliseconds;
}

function getQuarter(x: Date): number
{
  return Math.floor(x.getMonth() / MONTHS_IN_QUARTER);
}

function startOfSecond(x: Date): void
{
  x.setMilliseconds(0);
}

function startOfMinute(x: Date): void
{
  x.setSeconds(0, 0);
}

function startOfHour(x: Date): void
{
  x.setMinutes(0, 0, 0);
}

function startOfDay(x: Date): void
{
  x.setHours(0, 0, 0, 0);
}
function startOfWeek(x: Date, options: LocaleOptions = globalLocaleOptions): void
{
  const dayOfWeek = getDayOfWeek(x, options);

  x.setDate(x.getDate() - dayOfWeek);
  x.setHours(0, 0, 0, 0);
}

function startOfMonth(x: Date): void
{
  x.setDate(DAY_MIN);
  x.setHours(0, 0, 0, 0);
}

function startOfQuarter(x: Date): void
{
  const month = x.getMonth();

  x.setMonth(month - (month % MONTHS_IN_QUARTER), DAY_MIN);
  x.setHours(0, 0, 0, 0);
}

function startOfYear(x: Date): void
{
  const year = x.getFullYear();

  x.setTime(0);
  x.setFullYear(year, 0, 1);
  x.setHours(0, 0, 0, 0);
}

function endOfSecond(x: Date): void
{
  x.setMilliseconds(MILLIS_MAX);
}

function endOfMinute(x: Date): void
{
  x.setSeconds(SECOND_MAX, MILLIS_MAX);
}

function endOfHour(x: Date): void
{
  x.setMinutes(MINUTE_MAX, SECOND_MAX, MILLIS_MAX);
}

function endOfDay(x: Date): void
{
  x.setHours(HOUR_MAX, MINUTE_MAX, SECOND_MAX, MILLIS_MAX);
}

function endOfWeek(x: Date, options: LocaleOptions = globalLocaleOptions): void
{
  const dayOfWeek = getDayOfWeek(x, options);

  x.setDate(x.getDate() + (WEEKDAY_MAX - dayOfWeek));
  endOfDay(x);
}

function endOfMonth(x: Date): void
{
  x.setFullYear(x.getFullYear(), x.getMonth() + 1, 0);
  endOfDay(x);
}

function endOfQuarter(x: Date): void
{
  const month = x.getMonth();

  x.setMonth(month - (month % MONTHS_IN_QUARTER) + MONTHS_IN_QUARTER, DAY_MIN);
  endOfDay(x);
}

function endOfYear(x: Date): void
{
  x.setFullYear(x.getFullYear() + 1, 0, 0);
  endOfDay(x);
}

function addMilliseconds(x: Date, amount: number): void
{
  x.setTime(x.getTime() + amount);
}

function addSeconds(x: Date, amount: number): void
{
  addMilliseconds(x, amount * MILLIS_IN_SECOND);
}

function addMinutes(x: Date, amount: number): void
{
  addMilliseconds(x, amount * MILLIS_IN_MINUTE);
}

function addHours(x: Date, amount: number): void
{
  addMilliseconds(x, amount * MILLIS_IN_HOUR);
}

function addDays(x: Date, amount: number): void
{
  x.setDate(x.getDate() + amount);
}

function addWeeks(x: Date, amount: number): void
{
  addDays(x, amount * DAYS_IN_WEEK);
}

function addMonths(x: Date, amount: number): void
{
  const month = x.getMonth() + amount;

  const y = new Date(0)
  y.setFullYear(y.getFullYear(), month, 1)
  y.setHours(0, 0, 0, 0)
  const dayMax = getDaysInMonth(y);

  x.setMonth(month, Math.min(dayMax, x.getDate()));
}

function addQuarters(x: Date, amount: number): void
{
  addMonths(x, amount * MONTHS_IN_QUARTER);
}

function addYears(x: Date, amount: number): void
{
  addMonths(x, amount * MONTHS_IN_YEAR);
}

function diffMilliseconds(a: Date, b: Date): number
{
  return a.getTime() - b.getTime();
}

function diffSeconds(a: Date, b: Date): number
{
  return diffMilliseconds(a, b) / MILLIS_IN_SECOND;
}

function diffMinutes(a: Date, b: Date): number
{
  return diffMilliseconds(a, b) / MILLIS_IN_MINUTE;
}

function diffHours(a: Date, b: Date): number
{
  return diffMilliseconds(a, b) / MILLIS_IN_HOUR;
}

function diffDays(a: Date, b: Date): number 
{
  const leftTimestamp = getAbsoluteTimestamp(a);
  const rightTimestamp = getAbsoluteTimestamp(b);

  return (leftTimestamp - rightTimestamp) / MILLIS_IN_DAY;
}

function diffWeeks(a: Date, b: Date): number
{
  return diffDays(a, b) / DAYS_IN_WEEK;
}

function diffMonths(a: Date, b: Date): number
{
  const years = a.getFullYear() - b.getFullYear();
  const months = a.getMonth() - b.getMonth();
  const date = (a.getDate() - b.getDate()) / DAY_MAX;

  return years * MONTHS_IN_YEAR + months + date;
}

function diffQuarters(a: Date, b: Date): number
{
  return diffMonths(a, b) / MONTHS_IN_QUARTER;
}

function diffYears(a: Date, b: Date): number
{
  return diffMonths(a, b) / MONTHS_IN_YEAR;
}

let DayFormatter: Format<[Date, LocaleOptions]>;

const DayFormat = new Format<[Date, LocaleOptions]>({
  M:          ([day]) => (day.getMonth() + 1) + '',
  Mo:         ([day, locale]) => locale.suffix(day.getMonth() + 1),
  MM:         ([day]) => padNumber(day.getMonth() + 1, 2),
  MMm:        ([day, locale]) => locale.months[3][day.getMonth()],
  MMM:        ([day, locale]) => locale.months[2][day.getMonth()],
  MMMm:       ([day, locale]) => locale.months[1][day.getMonth()],
  MMMM:       ([day, locale]) => locale.months[0][day.getMonth()],
  Q:          ([day]) => (getQuarter(day) + 1) + '',
  Qo:         ([day, locale]) => locale.suffix(getQuarter(day) + 1),
  D:          ([day]) => day.getDate() + '',
  Do:         ([day, locale]) => locale.suffix(day.getDate()),
  DD:         ([day]) => padNumber(day.getDate(), 2),
  DDD:        ([day]) => getDayOfYear(day) + '',
  DDDo:       ([day, locale]) => locale.suffix(getDayOfYear(day)),
  DDDD:       ([day]) => padNumber(getDayOfYear(day), 3),
  d:          ([day]) => day.getDay() + '',
  do:         ([day, locale]) => locale.suffix(day.getDay()),
  dd:         ([day, locale]) => locale.weekdays[3][day.getDay()],
  ddd:        ([day, locale]) => locale.weekdays[2][day.getDay()],
  dddd:       ([day, locale]) => locale.weekdays[0][day.getDay()],
  e:          ([day]) => getDayOfWeek(day) + '',
  E:          ([day]) => (getDayOfWeek(day) + 1) + '',
  eo:         ([day, locale]) => locale.suffix(getDayOfWeek(day)),
  Eo:         ([day, locale]) => locale.suffix(getDayOfWeek(day) + 1),
  w:          ([day]) => getWeekOfYear(day) + '',
  wo:         ([day, locale]) => locale.suffix(getWeekOfYear(day)),
  ww:         ([day]) => padNumber(getWeekOfYear(day), 2),
  W:          ([day]) => getWeekOfYearISO(day) + '',
  Wo:         ([day, locale]) => locale.suffix(getWeekOfYearISO(day)),
  WW:         ([day]) => padNumber(getWeekOfYearISO(day), 2),
  Y:          ([day]) => day.getFullYear() + '',
  YY:         ([day]) => padNumber(day.getFullYear() % 100, 2),
  YYYY:       ([day]) => padNumber(day.getFullYear(), 4, 10),
  gg:         ([day]) => padNumber(day.getFullYear() % 100, 2),
  gggg:       ([day]) => padNumber(day.getFullYear(), 4, 10),
  GG:         ([day]) => padNumber(day.getFullYear() % 100, 2),
  GGGG:       ([day]) => padNumber(day.getFullYear(), 4, 10),
  a:          ([day, locale]) => day.getHours() < 12 ? locale.am : locale.pm,
  A:          ([day, locale]) => day.getHours() < 12 ? locale.am.toUpperCase() : locale.pm.toUpperCase(),
  H:          ([day]) => day.getHours() + '',
  HH:         ([day]) => padNumber(day.getHours(), 2),
  h:          ([day]) => ((day.getHours() % 12) || 12) + '',
  hh:         ([day]) => padNumber((day.getHours() % 12) || 12, 2),
  k:          ([day]) => (day.getHours() + 1) + '',
  kk:         ([day]) => padNumber(day.getHours() + 1, 2),
  m:          ([day]) => day.getMinutes() + '',
  mm:         ([day]) => padNumber(day.getMinutes(), 2),
  s:          ([day]) => day.getSeconds() + '',
  ss:         ([day]) => padNumber(day.getSeconds(), 2),
  S:          ([day]) => padNumber(day.getMilliseconds(), 3, 1),
  SS:         ([day]) => padNumber(day.getMilliseconds(), 3, 2),
  SSS:        ([day]) => padNumber(day.getMilliseconds(), 3),
  SSSS:       ([day]) => padNumber(day.getMilliseconds(), 3) + '0',
  SSSSS:      ([day]) => padNumber(day.getMilliseconds(), 3) + '00',
  SSSSSS:     ([day]) => padNumber(day.getMilliseconds(), 3) + '000',
  SSSSSSS:    ([day]) => padNumber(day.getMilliseconds(), 3) + '0000',
  SSSSSSSS:   ([day]) => padNumber(day.getMilliseconds(), 3) + '00000',
  SSSSSSSSS:  ([day]) => padNumber(day.getMilliseconds(), 3) + '000000',
  z:          ([day]) => day.toLocaleTimeString('en-us', {timeZoneName:'short'}).split(' ')[2],
  zz:         ([day]) => day.toLocaleTimeString('en-us', {timeZoneName:'long'}).split(' ')[2],
  Z:          ([day]) => formatOffset(day, ':'),
  ZZ:         ([day]) => formatOffset(day, ''),
  X:          ([day]) => Math.floor(day.valueOf() / 1000) + '',
  x:          ([day]) => day.valueOf() + '',
  LT:         ([day, locale]) => DayFormatter.format(locale.formatLT, [day, locale]),
  LTS:        ([day, locale]) => DayFormatter.format(locale.formatLTS, [day, locale]),
  L:          ([day, locale]) => DayFormatter.format(locale.formatL, [day, locale]),
  l:          ([day, locale]) => DayFormatter.format(locale.formatl, [day, locale]),
  LL:         ([day, locale]) => DayFormatter.format(locale.formatLL, [day, locale]),
  ll:         ([day, locale]) => DayFormatter.format(locale.formatll, [day, locale]),
  LLL:        ([day, locale]) => DayFormatter.format(locale.formatLLL, [day, locale]),
  lll:        ([day, locale]) => DayFormatter.format(locale.formatlll, [day, locale]),
  LLLL:       ([day, locale]) => DayFormatter.format(locale.formatLLLL, [day, locale]),
  llll:       ([day, locale]) => DayFormatter.format(locale.formatllll, [day, locale]),
}, {
  '[': {
    start: '[',
    startEscape: '\\[',
    end: ']',
    endEscape: '\\]'
  },
  "'": {
    start: "'",
    startEscape: "''",
    end: "'",
    endEscape: "''"
  }
});

DayFormatter = DayFormat;


function formatOffset(day: Date, splitter: string): string
{
  const off = getDateOffset(day);
  const hr = Math.floor(Math.abs(off) / 100);
  const mn = Math.abs(off) % 100;

  return (off < 0 ? '-' : '+') + padNumber(hr, 2) + splitter + padNumber(mn, 2);
}