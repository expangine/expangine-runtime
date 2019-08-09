
import { Runtime } from '../../Runtime';
import { defs } from '../../def';

import addExpressions from './expressions';
import addNumberOperations from './number';
import addTextOperations from './text';
import addBooleanOperations from './boolean';
import addAnyOperations from './any';
import addListOperations from './list';
import addMapOptions from './map';
import addObjectOptions from './object';


export const runtime = new Runtime(defs);

addAnyOperations(runtime);
addBooleanOperations(runtime);
addExpressions(runtime);
addListOperations(runtime);
addMapOptions(runtime);
addNumberOperations(runtime);
addObjectOptions(runtime);
addTextOperations(runtime);