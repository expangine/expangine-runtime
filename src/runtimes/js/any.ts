
import { Runtime } from '../../Runtime';
import { AnyOps } from '../../def/AnyOps';
import { compare, copy } from '../../fns';


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

};