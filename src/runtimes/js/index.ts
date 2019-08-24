
import { Runtime } from '../../Runtime';
import { defs } from '../../def';

import addExpressions from './expressions';
import addNumberOperations from './number';
import addTextOperations from './text';
import addBooleanOperations from './boolean';
import addAnyOperations from './any';
import addListOperations from './list';
import addMapOperations from './map';
import addObjectOperations from './object';
import addDateOperations from './date';
import addTupleOperations from './tuple';


export const runtime = new Runtime(defs);

addAnyOperations(runtime);
addBooleanOperations(runtime);
addDateOperations(runtime);
addExpressions(runtime);
addListOperations(runtime);
addMapOperations(runtime);
addNumberOperations(runtime);
addObjectOperations(runtime);
addTextOperations(runtime);
addTupleOperations(runtime);
