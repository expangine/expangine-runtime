
import { Format } from './Format';
import { LocaleOptions } from '../Locale';
import { padNumber } from '../fns';
import { getQuarter, getDayOfYear, getDayOfWeek, getWeekOfYear, getWeekOfYearISO, getDateOffset } from './DateFunctions';


// tslint:disable: no-magic-numbers


export const DateFormat = new Format<[Date, LocaleOptions]>({
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
  LT:         ([day, locale]) => DateFormatter.format(locale.formatLT, [day, locale]),
  LTS:        ([day, locale]) => DateFormatter.format(locale.formatLTS, [day, locale]),
  L:          ([day, locale]) => DateFormatter.format(locale.formatL, [day, locale]),
  l:          ([day, locale]) => DateFormatter.format(locale.formatl, [day, locale]),
  LL:         ([day, locale]) => DateFormatter.format(locale.formatLL, [day, locale]),
  ll:         ([day, locale]) => DateFormatter.format(locale.formatll, [day, locale]),
  LLL:        ([day, locale]) => DateFormatter.format(locale.formatLLL, [day, locale]),
  lll:        ([day, locale]) => DateFormatter.format(locale.formatlll, [day, locale]),
  LLLL:       ([day, locale]) => DateFormatter.format(locale.formatLLLL, [day, locale]),
  llll:       ([day, locale]) => DateFormatter.format(locale.formatllll, [day, locale]),
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

const DateFormatter: Format<[Date, LocaleOptions]> = DateFormat;

function formatOffset(day: Date, splitter: string): string
{
  const off = getDateOffset(day);
  const hr = Math.floor(Math.abs(off) / 100);
  const mn = Math.abs(off) % 100;

  return (off < 0 ? '-' : '+') + padNumber(hr, 2) + splitter + padNumber(mn, 2);
}