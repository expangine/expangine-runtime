
import { compare, copy, toString, isEmpty, isObject, isBoolean, isDate, isArray, isMap, isNumber, isString } from '../../fns';
import { ObjectOps } from '../../ops/ObjectOps';
import { _object, restoreScope, saveScope } from './helper';
import { runtime as run, LiveCommand, LiveContext } from './runtime';


// Static 

run.setOperation(ObjectOps.create, (params) => (context) =>
  Object.create(null)
);

// Operations

run.setOperation(ObjectOps.has, (params) => (context) =>
  params.key(context) in _object(params.object, context)
);

run.setOperation(ObjectOps.get, (params) => (context) =>
  _object(params.object, context)[params.key(context)]
);

run.setOperation(ObjectOps.set, (params, scope) => (context) => {
  const object = _object(params.object, context);
  const key = params.key(context);
  const saved = saveScope(context, scope);

  context[scope.existingValue] = object[key];

  const value = params.value(context);

  object[key] = value;

  restoreScope(context, saved);

  return object;
});

run.setOperation(ObjectOps.delete, (params) => (context) => {
  const object = _object(params.object, context);
  const key = params.key(context);
  const value = object[key];

  delete object[key];

  return value;
});

run.setOperation(ObjectOps.cmp, (params) => (context) => 
  compare(_object(params.value, context), _object(params.test, context))
);

run.setOperation(ObjectOps.copy, (params) => (context) =>
  copy(_object(params.object, context))
);

// Comparisons

run.setOperation(ObjectOps.isValid, (params) => (context) => 
  isObject(params.value(context))
);

run.setOperation(ObjectOps.isEqual, (params) => (context) => 
  compare(_object(params.value, context), _object(params.test, context)) === 0
);

run.setOperation(ObjectOps.isNotEqual, (params) => (context) => 
  compare(_object(params.value, context), _object(params.test, context)) !== 0
);

run.setOperation(ObjectOps.isLess, (params) => (context) => 
  compare(_object(params.value, context), _object(params.test, context)) < 0
);

run.setOperation(ObjectOps.isLessOrEqual, (params) => (context) => 
  compare(_object(params.value, context), _object(params.test, context)) <= 0
);

run.setOperation(ObjectOps.isGreater, (params) => (context) => 
  compare(_object(params.value, context), _object(params.test, context)) > 0
);

run.setOperation(ObjectOps.isGreaterOrEqual, (params) => (context) => 
  compare(_object(params.value, context), _object(params.test, context)) >= 0
);

// Casts

run.setOperation(ObjectOps.asAny, (params) => (context) =>
  params.value(context)
);

run.setOperation(ObjectOps.asBoolean, (params) => (context) =>
  tryCastValue(params.value, context, isBoolean, () => true)
);

run.setOperation(ObjectOps.asDate, (params) => (context) =>
  tryCastValue(params.value, context, isDate, () => new Date())
);

run.setOperation(ObjectOps.asList, (params) => (context) => 
  tryCastValue(params.value, context, isArray, v => isEmpty(v) ? [] : [v])
);

run.setOperation(ObjectOps.asMap, (params) => (context) => 
  tryCastValue(params.value, context, isMap, v => isEmpty(v) ? new Map() : new Map([['value', v]]))
);

run.setOperation(ObjectOps.asNumber, (params) => (context) => 
  tryCastValue(params.value, context, isNumber, () => 0)
);

run.setOperation(ObjectOps.asObject, (params) => (context) => 
  params.value(context)
);

run.setOperation(ObjectOps.asText, (params) => (context) => 
  tryCastValue(params.value, context, isString, v => toString(v))
);

run.setOperation(ObjectOps.asTuple, (params) => (context) => 
  tryCastValue(params.value, context, isArray, v => [v])
);


function tryCastValue(value: LiveCommand, context: LiveContext, isType: (value: any) => boolean, otherwise: (value: any) => any)
{
  const val = value(context);

  return isObject(val) && isType(val.value)
    ? val.value
    : otherwise(val);
}