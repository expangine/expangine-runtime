
import { Runtime } from '../../Runtime';
import { defs } from '../../def';

import addExpressions from './expressions';
import addNumberOperations from './number';
import addTextOperations from './text';
import addBooleanOperations from './boolean';



export const runtime = new Runtime(defs);

addExpressions(runtime);
addNumberOperations(runtime);
addTextOperations(runtime);
addBooleanOperations(runtime);