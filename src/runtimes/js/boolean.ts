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