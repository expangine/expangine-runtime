
import { compare, copy, isBoolean, isDate, isEmpty, isNumber, isString } from '../../fns';
import { Runtime } from '../../Runtime';
import { TupleOps } from '../../ops/TupleOps';
import { _list, _number } from './helper';


export default (run: Runtime) =>
{

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
    _list(params.value, context).find(isBoolean) || false
  );

  run.setOperation(TupleOps.asDate, (params) => (context) =>
    _list(params.value, context).find(isDate) || new Date()
  );

  run.setOperation(TupleOps.asList, (params) => (context) => {
    const value = params.value(context);

    return isEmpty(value) ? [] : [value];
  });

  run.setOperation(TupleOps.asMap, (params) => (context) => {
    const value = params.value(context);

    return isEmpty(value) ? new Map() : new Map([['0', value]]);
  });

  run.setOperation(TupleOps.asNumber, (params) => (context) => 
    _list(params.value, context).find(isNumber) || 0
  );

  run.setOperation(TupleOps.asObject, (params) => (context) => 
    ({ value: params.value(context) })
  );

  run.setOperation(TupleOps.asText, (params) => (context) => 
    _list(params.value, context).find(isString) || ''
  );

  run.setOperation(TupleOps.asTuple, (params) => (context) => 
    params.value(context)
  );

};