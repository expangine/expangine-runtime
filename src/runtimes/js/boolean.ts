import { Runtime } from '../../Runtime';
import { _bool, _asList, _asObject, _asTuple, _asMap } from './helper';
import { isBoolean } from '../../fns';
import { BooleanOps } from '../../ops/BooleanOps';



export default (run: Runtime) =>
{

  // Static
  
  run.setOperation(BooleanOps.create, (params) => (context) =>
    false
  );

  // Operations

  run.setOperation(BooleanOps.and, (params) => (context) => 
    _bool(params.a, context) && _bool(params.b, context)
  );

  run.setOperation(BooleanOps.or, (params) => (context) => 
    _bool(params.a, context) || _bool(params.b, context)
  );

  run.setOperation(BooleanOps.xor, (params) => (context) => 
    _bool(params.a, context) !== _bool(params.b, context)
  );

  run.setOperation(BooleanOps.not, (params) => (context) => 
    !_bool(params.a, context)
  );

  run.setOperation(BooleanOps.cmp, (params) => (context) => 
    (_bool(params.value, context) ? 1 : 0) - (_bool(params.test, context) ? 1 : 0)
  );

  // Comparisons

  run.setOperation(BooleanOps.isValid, (params) => (context) => 
    isBoolean(params.value(context))
  );

  run.setOperation(BooleanOps.isTrue, (params) => (context) => 
    _bool(params.value, context, false)
  );

  run.setOperation(BooleanOps.isFalse, (params) => (context) => 
    !_bool(params.value, context, false)
  );

  // Casts

  run.setOperation(BooleanOps.asAny, (params) => (context) =>
    params.value(context)
  );

  run.setOperation(BooleanOps.asBoolean, (params) => (context) =>
    !!params.value(context)
  );

  run.setOperation(BooleanOps.asDate, (params) => (context) =>
    new Date()
  );

  run.setOperation(BooleanOps.asList, (params) => (context) =>
    _asList(params.value, context)
  );

  run.setOperation(BooleanOps.asMap, (params) => (context) =>
    _asMap(params.value, context)
  );

  run.setOperation(BooleanOps.asNumber, (params) => (context) => {
    const value = params.value(context);

    return value ? 1 : 0;
  });

  run.setOperation(BooleanOps.asObject, (params) => (context) => 
    _asObject(params.value, context)
  );

  run.setOperation(BooleanOps.asText, (params) => (context) => 
    params.value(context) ? 'true' : 'false'
  );

  run.setOperation(BooleanOps.asTuple, (params) => (context) => 
    _asTuple(params.value, context)
  );

};