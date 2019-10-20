import { LocaleOptions } from '../../Locale';
import { currentLocale } from '../../locales';
import { MILLIS_IN_SECOND, DAYS_IN_WEEK, WEEKDAY_MAX, MILLIS_IN_MINUTE, MONTHS_IN_QUARTER, DAY_MIN, MILLIS_MAX, SECOND_MAX, MINUTE_MAX, HOUR_MAX, MILLIS_IN_HOUR, MONTHS_IN_YEAR, MILLIS_IN_DAY, DAY_MAX } from './DateConstants';
import { isDate, isNumber, isString } from '../../fns';


// tslint:disable: no-magic-numbers


export type Unit = 
  'millis' | 
  'second' | 
  'minute' | 
  'hour' | 
  'day' | 
  'week' | 
  'month' |
  'quarter' |
  'year';

export type UnitRecord<T> = Record<Unit, T>;

export type Adjuster = (value: number) => number;

export const adjusters: Record<string, Adjuster> = 
{
  none:     (value) => value,
  floor:    (value) => Math.floor(value),
  ceil:     (value) => Math.ceil(value),
  round:    (value) => Math.round(value),
  truncate: (value) => value < 0 ? Math.ceil(value) : Math.floor(value),
  down:     (value) => value < 0 ? Math.ceil(value) : Math.floor(value),
  up:       (value) => value < 0 ? Math.floor(value) : Math.ceil(value),
};

export type Getter = (x: Date) => number;

export const getters: Record<string, Getter> = 
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

export type Setter = (x: Date, value: number) => void;

export const setters: Record<string, Setter> = 
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

export type Starter = (x: Date, options?: LocaleOptions) => void;

export const startOf: UnitRecord<Starter> = 
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

export type Ender = (x: Date, options?: LocaleOptions) => void;

export const endOf: UnitRecord<Ender> = 
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

export type Adder = (x: Date, amount: number) => void;

export const add: UnitRecord<Adder> = 
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

export type Differ = (a: Date, b: Date) => number;

export const diff: UnitRecord<Differ> = 
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

export function mutate(a: Date, mutator: (a: Date, options?: LocaleOptions) => void, options?: LocaleOptions): Date
{
  const b = new Date(a.getTime());

  mutator(b, options);

  return b;
}

export function compareDates(a: Date, b: Date, precision: Unit = 'millis', options: LocaleOptions = currentLocale): number
{
  const starter = startOf[precision];
  const x = mutate(a, starter, options);
  const y = mutate(b, starter, options);

  return x.getTime() - y.getTime();
}

export function parse(value: any, parseAsUTC: boolean = false): Date | null
{
  if (isDate(value))
  {
    return value;
  }

  if (isNumber(value) && value > 0)
  {
    return new Date(value);
  }

  if (isString(value))
  {
    if (parseAsUTC)
    {
      const withUTC = value + ' UTC';
      const parsedUTC = Date.parse(withUTC);

      if (isFinite(parsedUTC))
      {
        return new Date(parsedUTC);
      }
    }

    const parsed = Date.parse(value);

    if (isFinite(parsed))
    {
      return new Date(parsed);
    }
  }

  return null;
}

export function getTimeIdentifier(x: Date): number
{
  return x.getFullYear() * 100000000
       + (x.getMonth() + 1) * 1000000
       + x.getDate() * 10000
       + x.getHours() * 100
       + x.getMinutes();
}

export function getDayIdentifier(x: Date): number
{
  return x.getFullYear() * 10000
       + (x.getMonth() + 1) * 100
       + x.getDate();
}

export function getWeekIdentifier(x: Date): number
{
  return x.getFullYear() * 1000
       + getWeekOfYear(x);
}

export function getMonthIdentifier(x: Date): number
{
  return x.getFullYear() * 100
       + (x.getMonth() + 1);
}

export function getQuarterIdentifier(x: Date): number
{
  return x.getFullYear() * 10
       + getQuarter(x);
}

export function getLastDayOfMonth(x: Date): number
{
  return getDaysInMonth(x) - x.getDate() + 1;
}

export function getLastWeekspanOfYear(x: Date): number
{
  const fromEnd = getDaysInYear(x) - getDayOfYear(x);

  return Math.floor(fromEnd / DAYS_IN_WEEK);
}

export function getWeekOfYearISO(x: Date, options: LocaleOptions = currentLocale): number
{
  return getWeekISO(mutate(x, startOfYear), getDayOfYear(x), options);
}

export function getWeekOfYear(x: Date, options: LocaleOptions = currentLocale): number
{
  return getWeek(mutate(x, startOfYear), getDayOfYear(x), options);
}

export function getWeekspanOfYear(x: Date): number
{
  return Math.floor((getDayOfYear(x) - 1) / DAYS_IN_WEEK);
}

export function getFullWeekOfYear(x: Date, options: LocaleOptions = currentLocale): number
{
  return getFullWeekOf(mutate(x, startOfYear), getDaysInYear(x), options);
}

export function getWeeksInYear(x: Date, options: LocaleOptions = currentLocale): number
{
  return getWeekOfYearISO(mutate(x, endOfYear), options) + 1;
}

export function getLastFullWeekOfYear(x: Date, options: LocaleOptions = currentLocale): number
{
  const lastOfYear = mutate(x, endOfYear);
  const week = getWeekOfYearISO(x, options);
  const weekMax = getWeekOfYearISO(lastOfYear, options);
  const lastWeek = weekMax - week;

  return getDayOfWeek(lastOfYear, options) === WEEKDAY_MAX 
    ? lastWeek + 1
    : lastWeek;
}

export function getWeekspanOfMonth(x: Date): number
{
  return Math.floor((x.getDate() - 1) / DAYS_IN_WEEK);
}

export function getLastWeekspanOfMonth(x: Date): number
{
  const fromEnd = getDaysInMonth(x) - x.getDate();

  return Math.floor(fromEnd / DAYS_IN_WEEK);
}

export function getFullWeekOfMonth(x: Date, options: LocaleOptions = currentLocale): number
{
  return getFullWeekOf(mutate(x, startOfMonth), x.getDate(), options);
}

export function getLastFullWeekOfMonth(x: Date, options: LocaleOptions = currentLocale): number
{
  const fromEnd = getDaysInMonth(x) - x.getDate();
  const invertedDayOfWeek = WEEKDAY_MAX - getDayOfWeek(x, options);
  
  return Math.floor((fromEnd - invertedDayOfWeek + DAYS_IN_WEEK) / DAYS_IN_WEEK);
}

export function getWeekOfMonthISO(x: Date, options: LocaleOptions = currentLocale): number
{
  return getWeekISO(mutate(x, startOfMonth), x.getDate(), options);
}

export function getWeekOfMonth(x: Date, options: LocaleOptions = currentLocale): number
{
  return getWeek(mutate(x, startOfMonth), x.getDate(), options);
}

export function getWeekISO(start: Date, dayOfStart: number, options: LocaleOptions = currentLocale): number
{
  const { firstWeekContainsDate } = options;
  const dayOfWeekFirst = getDayOfWeek(start, options);
  const hasWeekZero = DAYS_IN_WEEK - dayOfWeekFirst < firstWeekContainsDate;
  const offset = hasWeekZero
    ? dayOfWeekFirst - 1
    : dayOfWeekFirst - 1 + DAYS_IN_WEEK;

  return Math.floor((dayOfStart + offset) / DAYS_IN_WEEK);
}

export function getWeek(start: Date, dayOfStart: number, options: LocaleOptions): number
{
  const dayOfWeekFirst = getDayOfWeek(start, options);
  const offset = dayOfWeekFirst - 1 + DAYS_IN_WEEK;

  return Math.floor((dayOfStart + offset) / DAYS_IN_WEEK);
}

export function getFullWeekOf(start: Date, dayOfStart: number, options: LocaleOptions = currentLocale): number
{
  const dayOfWeekFirst = getDayOfWeek(start, options);
  const hasWeekZero = dayOfWeekFirst !== 0; // Sunday
  const offset = hasWeekZero
    ? dayOfWeekFirst - 1
    : dayOfWeekFirst - 1 + DAYS_IN_WEEK;

  return Math.floor((dayOfStart + offset) / DAYS_IN_WEEK);
}

export function getDayOfWeek(x: Date, options: LocaleOptions = currentLocale): number
{
  const { weekStartsOn } = options;
  const day = x.getDay();

  return day < weekStartsOn 
    ? day - weekStartsOn + DAYS_IN_WEEK
    : day - weekStartsOn;
}

export function getDayOfYear(a: Date): number
{
  return Math.round(diffDays(a, mutate(a, startOfYear))) + 1;
}

export function getDateOffset(x: Date): number
{
  return -Math.round(x.getTimezoneOffset() / 15) * 15;
}

export function isDaylightSavingTime(x: Date): boolean
{
  const offset = getDateOffset(x);

  return (
    offset > getDateOffset(mutate(x, d => d.setMonth(0))) ||
    offset > getDateOffset(mutate(x, d => d.setMonth(5)))
  );
}

export function isLeapYear(x: Date): boolean
{
  const year = x.getFullYear();

  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

export function getDaysInYear(x: Date): number
{
  return isLeapYear(x) ? 366 : 365;
}

export const daysInMonth = [
  [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];

export function getDaysInMonth(x: Date): number
{
  return daysInMonth[isLeapYear(x) ? 1 : 0][x.getMonth()];
}

export function getAbsoluteTimestamp(a: Date): number
{
  return a.getTime() - getTimezoneOffsetInMilliseconds(a);
}

export function getTimezoneOffsetInMilliseconds(a: Date): number
{
  const b = new Date(a.getTime());
  const offsetMinutes = b.getTimezoneOffset();

  b.setSeconds(0, 0);

  const offsetMilliseconds = b.getTime() % MILLIS_IN_MINUTE;

  return offsetMinutes * MILLIS_IN_MINUTE + offsetMilliseconds;
}

export function getQuarter(x: Date): number
{
  return Math.floor(x.getMonth() / MONTHS_IN_QUARTER);
}

export function startOfSecond(x: Date): void
{
  x.setMilliseconds(0);
}

export function startOfMinute(x: Date): void
{
  x.setSeconds(0, 0);
}

export function startOfHour(x: Date): void
{
  x.setMinutes(0, 0, 0);
}

export function startOfDay(x: Date): void
{
  x.setHours(0, 0, 0, 0);
}

export function startOfWeek(x: Date, options: LocaleOptions = currentLocale): void
{
  const dayOfWeek = getDayOfWeek(x, options);

  x.setDate(x.getDate() - dayOfWeek);
  x.setHours(0, 0, 0, 0);
}

export function startOfMonth(x: Date): void
{
  x.setDate(DAY_MIN);
  x.setHours(0, 0, 0, 0);
}

export function startOfQuarter(x: Date): void
{
  const month = x.getMonth();

  x.setMonth(month - (month % MONTHS_IN_QUARTER), DAY_MIN);
  x.setHours(0, 0, 0, 0);
}

export function startOfYear(x: Date): void
{
  const year = x.getFullYear();

  x.setTime(0);
  x.setFullYear(year, 0, 1);
  x.setHours(0, 0, 0, 0);
}

export function endOfSecond(x: Date): void
{
  x.setMilliseconds(MILLIS_MAX);
}

export function endOfMinute(x: Date): void
{
  x.setSeconds(SECOND_MAX, MILLIS_MAX);
}

export function endOfHour(x: Date): void
{
  x.setMinutes(MINUTE_MAX, SECOND_MAX, MILLIS_MAX);
}

export function endOfDay(x: Date): void
{
  x.setHours(HOUR_MAX, MINUTE_MAX, SECOND_MAX, MILLIS_MAX);
}

export function endOfWeek(x: Date, options: LocaleOptions = currentLocale): void
{
  const dayOfWeek = getDayOfWeek(x, options);

  x.setDate(x.getDate() + (WEEKDAY_MAX - dayOfWeek));
  endOfDay(x);
}

export function endOfMonth(x: Date): void
{
  x.setFullYear(x.getFullYear(), x.getMonth() + 1, 0);
  endOfDay(x);
}

export function endOfQuarter(x: Date): void
{
  const month = x.getMonth();

  x.setMonth(month - (month % MONTHS_IN_QUARTER) + MONTHS_IN_QUARTER, DAY_MIN);
  endOfDay(x);
}

export function endOfYear(x: Date): void
{
  x.setFullYear(x.getFullYear() + 1, 0, 0);
  endOfDay(x);
}

export function addMilliseconds(x: Date, amount: number): void
{
  x.setTime(x.getTime() + amount);
}

export function addSeconds(x: Date, amount: number): void
{
  addMilliseconds(x, amount * MILLIS_IN_SECOND);
}

export function addMinutes(x: Date, amount: number): void
{
  addMilliseconds(x, amount * MILLIS_IN_MINUTE);
}

export function addHours(x: Date, amount: number): void
{
  addMilliseconds(x, amount * MILLIS_IN_HOUR);
}

export function addDays(x: Date, amount: number): void
{
  x.setDate(x.getDate() + amount);
}

export function addWeeks(x: Date, amount: number): void
{
  addDays(x, amount * DAYS_IN_WEEK);
}

export function addMonths(x: Date, amount: number): void
{
  const month = x.getMonth() + amount;

  const y = new Date(0)
  y.setFullYear(y.getFullYear(), month, 1)
  y.setHours(0, 0, 0, 0)
  const dayMax = getDaysInMonth(y);

  x.setMonth(month, Math.min(dayMax, x.getDate()));
}

export function addQuarters(x: Date, amount: number): void
{
  addMonths(x, amount * MONTHS_IN_QUARTER);
}

export function addYears(x: Date, amount: number): void
{
  addMonths(x, amount * MONTHS_IN_YEAR);
}

export function diffMilliseconds(a: Date, b: Date): number
{
  return a.getTime() - b.getTime();
}

export function diffSeconds(a: Date, b: Date): number
{
  return diffMilliseconds(a, b) / MILLIS_IN_SECOND;
}

export function diffMinutes(a: Date, b: Date): number
{
  return diffMilliseconds(a, b) / MILLIS_IN_MINUTE;
}

export function diffHours(a: Date, b: Date): number
{
  return diffMilliseconds(a, b) / MILLIS_IN_HOUR;
}

export function diffDays(a: Date, b: Date): number 
{
  const leftTimestamp = getAbsoluteTimestamp(a);
  const rightTimestamp = getAbsoluteTimestamp(b);

  return (leftTimestamp - rightTimestamp) / MILLIS_IN_DAY;
}

export function diffWeeks(a: Date, b: Date): number
{
  return diffDays(a, b) / DAYS_IN_WEEK;
}

export function diffMonths(a: Date, b: Date): number
{
  const years = a.getFullYear() - b.getFullYear();
  const months = a.getMonth() - b.getMonth();
  const date = (a.getDate() - b.getDate()) / DAY_MAX;

  return years * MONTHS_IN_YEAR + months + date;
}

export function diffQuarters(a: Date, b: Date): number
{
  return diffMonths(a, b) / MONTHS_IN_QUARTER;
}

export function diffYears(a: Date, b: Date): number
{
  return diffMonths(a, b) / MONTHS_IN_YEAR;
}
