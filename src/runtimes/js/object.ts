
import { compare, copy, toString, isEmpty } from '../../fns';
import { Runtime } from '../../Runtime';
import { ObjectOps } from '../../ops/ObjectOps';
import { _object } from './helper';


export default (run: Runtime) =>
{

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

  run.setOperation(ObjectOps.set, (params) => (context) => {
    const object = _object(params.object, context);
    const key = params.key(context);
    const value = params.value(context);

    object[key] = value;

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
    true
  );

  run.setOperation(ObjectOps.asDate, (params) => (context) =>
    new Date()
  );

  run.setOperation(ObjectOps.asList, (params) => (context) => {
    const value = params.value(context);

    return isEmpty(value) ? [] : [value];
  });

  run.setOperation(ObjectOps.asMap, (params) => (context) => {
    const value = params.value(context);

    return isEmpty(value) ? new Map() : new Map([['0', value]]);
  });

  run.setOperation(ObjectOps.asNumber, (params) => (context) => 
    0
  );

  run.setOperation(ObjectOps.asObject, (params) => (context) => 
    params.value(context)
  );

  run.setOperation(ObjectOps.asText, (params) => (context) => 
    toString(params.value(context))
  );

  run.setOperation(ObjectOps.asTuple, (params) => (context) => 
    [params.value(context)]
  );

};