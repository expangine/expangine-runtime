import { Runtime } from '../../Runtime';
import { _bool } from './helper';
import { isBoolean } from '../../fns';
import { BooleanOps } from '../../def/BooleanOps';



export default (run: Runtime) =>
{

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
    _bool(params.value, context, false) === true
  );

  run.setOperation(BooleanOps.isFalse, (params) => (context) => 
    _bool(params.value, context, false) === false
  );

};