import { Runtime } from '../../Runtime';
import { bool } from './helper';
import { isBoolean } from '../../fns';
import { BooleanOps } from '../../def/BooleanOps';



export default (run: Runtime) =>
{

  // Operations

  run.setOperation(BooleanOps.and, (params) => (context) => 
    bool(params.a, context) && bool(params.b, context)
  );

  run.setOperation(BooleanOps.or, (params) => (context) => 
    bool(params.a, context) || bool(params.b, context)
  );

  run.setOperation(BooleanOps.xor, (params) => (context) => 
    bool(params.a, context) !== bool(params.b, context)
  );

  run.setOperation(BooleanOps.not, (params) => (context) => 
    !bool(params.a, context)
  );

  run.setOperation(BooleanOps.cmp, (params) => (context) => 
    (bool(params.value, context) ? 1 : 0) - (bool(params.test, context) ? 1 : 0)
  );

  // Comparisons

  run.setOperation(BooleanOps.isValid, (params) => (context) => 
    isBoolean(params.a(context))
  );

  run.setOperation(BooleanOps.isTrue, (params) => (context) => 
    bool(params.a, context) === true
  );

  run.setOperation(BooleanOps.isFalse, (params) => (context) => 
    bool(params.a, context) === false
  );

};