
import { compare, copy, isBoolean, isDate, isEmpty, isNumber, isString, isArray, isMap, isObject } from '../../fns';
import { TupleOps } from '../../ops/TupleOps';
import { _list, _number } from './helper';
import { runtime as run, LiveContext, LiveCommand } from './runtime';


// Statics

run.setOperation(TupleOps.create, (params) => (context) =>
  []
);

// Operations

run.setOperation(TupleOps.cmp, (params) => (context) => 
  compare(params.value(context), params.test(context))
);

run.setOperation(TupleOps.copy, (params) => (context) =>
  copy(params.value(context))
);

run.setOperation(TupleOps.get, (params) => (context) =>
  _list(params.value, context)[_number(params.index, context, 0)]
);

run.setOperation(TupleOps.set, (params) => (context) => {
  const tuple = _list(params.value, context);
  const index = _number(params.index, context, 0);
  const existing = tuple[index];
  tuple[index] = params.element(context);
  
  return existing;
});

// Comparisons

run.setOperation(TupleOps.isValid, (params) => (context) => 
  isArray(params.value(context))
);

run.setOperation(TupleOps.isEqual, (params) => (context) => 
  compare(params.value(context), params.test(context)) === 0
);

run.setOperation(TupleOps.isNotEqual, (params) => (context) => 
  compare(params.value(context), params.test(context)) !== 0
);

run.setOperation(TupleOps.isLess, (params) => (context) => 
  compare(params.value(context), params.test(context)) < 0
);

run.setOperation(TupleOps.isLessOrEqual, (params) => (context) => 
  compare(params.value(context), params.test(context)) <= 0
);

run.setOperation(TupleOps.isGreater, (params) => (context) => 
  compare(params.value(context), params.test(context)) > 0
);

run.setOperation(TupleOps.isGreaterOrEqual, (params) => (context) => 
  compare(params.value(context), params.test(context)) >= 0
);

// Casts

run.setOperation(TupleOps.asAny, (params) => (context) =>
  params.value(context)
);

run.setOperation(TupleOps.asBoolean, (params) => (context) =>
  tryCastValue(params.value, context, isBoolean, (v) => v.find ? v.find(isBoolean) || false : false)
);

run.setOperation(TupleOps.asDate, (params) => (context) =>
  tryCastValue(params.value, context, isDate, (v) => v.find ? v.find(isDate) || new Date() : new Date())
);

run.setOperation(TupleOps.asList, (params) => (context) => 
  tryCastValue(params.value, context, isArray, (v) => isEmpty(v) ? [] : [v])
);

run.setOperation(TupleOps.asMap, (params) => (context) => 
  tryCastValue(params.value, context, isMap, (v) => isEmpty(v) ? new Map() : new Map([['value', v]]))
);

run.setOperation(TupleOps.asNumber, (params) => (context) => 
  tryCastValue(params.value, context, isNumber, (v) => v.find ? v.find(isNumber) || 0 : 0)
);

run.setOperation(TupleOps.asObject, (params) => (context) => 
  tryCastValue(params.value, context, isObject, (value) => ({ value }))
);

run.setOperation(TupleOps.asText, (params) => (context) => 
  tryCastValue(params.value, context, isString, (v) => v.find ? v.find(isString) || '' : '')
);

run.setOperation(TupleOps.asTuple, (params) => (context) => 
  params.value(context)
);

function tryCastValue(value: LiveCommand, context: LiveContext, isType: (value: any) => boolean, otherwise: (value: any) => any)
{
  const val = value(context);

  return isArray(val) && isType(val[0])
    ? val[0]
    : otherwise(val);
}