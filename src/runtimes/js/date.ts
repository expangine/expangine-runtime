
import { Runtime } from '../../Runtime';
import { DateOps } from '../../ops/DateOps';
import { _number, _date, _text, _bool } from './helper';
import { DateType } from '../../types/Date';
import { currentLocale } from '../../locales';
import { compareDates, startOf, mutate, add, getters, setters, endOf, getDaysInMonth, getDaysInYear, getWeeksInYear, diff, adjusters, getDateOffset, isDaylightSavingTime, isLeapYear, Unit } from '../../util/DateFunctions';
import { DateFormat } from '../../util/DateFormat';


// tslint:disable: no-magic-numbers


export default (run: Runtime) =>
{

  // Static

  run.setOperation(DateOps.create, (params) => (context) =>
    new Date()
  ),

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

  // Operations

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

    return unit in startOf ? compareDates(value, test, unit) : 0;
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
    DateFormat.format(_text(params.format, context), [_date(params.value, context), currentLocale])
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

    const startCompare = compareDates(value, start, unit);
    const endCompare = compareDates(value, end, unit);
    
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
