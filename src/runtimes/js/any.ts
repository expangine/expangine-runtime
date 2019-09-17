
import { Runtime } from '../../Runtime';
import { AnyOps } from '../../ops/AnyOps';
import { compare, copy, toString } from '../../fns';
import { parse } from '../../util/DateFunctions';
import { _asList, _asTuple, _asMap, _asObject } from './helper';


export default (run: Runtime) =>
{

  // Operations

  run.setOperation(AnyOps.cmp, (params) => (context) => 
    compare(params.value(context), params.test(context))
  );

  run.setOperation(AnyOps.copy, (params) => (context) =>
    copy(params.value(context))
  );

  // Comparisons

  run.setOperation(AnyOps.isValid, (params) => (context) => 
    true
  );

  run.setOperation(AnyOps.isEqual, (params) => (context) => 
    compare(params.value(context), params.test(context)) === 0
  );

  run.setOperation(AnyOps.isNotEqual, (params) => (context) => 
    compare(params.value(context), params.test(context)) !== 0
  );

  run.setOperation(AnyOps.isLess, (params) => (context) => 
    compare(params.value(context), params.test(context)) < 0
  );

  run.setOperation(AnyOps.isLessOrEqual, (params) => (context) => 
    compare(params.value(context), params.test(context)) <= 0
  );

  run.setOperation(AnyOps.isGreater, (params) => (context) => 
    compare(params.value(context), params.test(context)) > 0
  );

  run.setOperation(AnyOps.isGreaterOrEqual, (params) => (context) => 
    compare(params.value(context), params.test(context)) >= 0
  );

  // Casts

  run.setOperation(AnyOps.asAny, (params) => (context) =>
    params.value(context)
  );

  run.setOperation(AnyOps.asBoolean, (params) => (context) =>
    !!params.value(context)
  );

  run.setOperation(AnyOps.asDate, (params) => (context) =>
    parse(params.value(context)) || new Date()
  );

  run.setOperation(AnyOps.asList, (params) => (context) =>
    _asList(params.value, context)
  );

  run.setOperation(AnyOps.asMap, (params) => (context) => 
    _asMap(params.value, context)
  );

  run.setOperation(AnyOps.asNumber, (params) => (context) => {
    const value = parseFloat(params.value(context));

    return isFinite(value) ? value : 0;
  });

  run.setOperation(AnyOps.asObject, (params) => (context) => 
    _asObject(params.value, context)
  );

  run.setOperation(AnyOps.asText, (params) => (context) => 
    toString(params.value(context))
  );

  run.setOperation(AnyOps.asTuple, (params) => (context) => 
    _asTuple(params.value, context)
  );

};