
import { Operations } from '../Operation';
import { ID } from '../types/ID';
import { Computeds } from '../Computed';


export const TupleOperations = new Operations(ID.Tuple + ID.Delimiter);

export const TupleComputeds = new Computeds(ID.Tuple + ID.Delimiter);

const ops = TupleOperations;

export const TupleOps = 
{

  // Statics

  create: ops.set('create'),

  // Operations

  maybe: ops.set('maybe', {}, ['value']),

  cmp: ops.set('cmp', {}, ['value', 'test']),

  copy: ops.set('copy', {}, ['value']),

  build: ops.set('build', {}, ['a', 'b'], ['c', 'd', 'e'], [], [], ['a', 'b', 'c', 'd', 'e']),

  get: ops.set('get', {}, ['value', 'index']),

  set: ops.set('set', { mutates: ['value'] }, ['value', 'index', 'element']),

  // Comparisons
  
  isValid: ops.set('?', {}, ['value']),

  isEqual: ops.set('=', {}, ['value', 'test']),

  isNotEqual: ops.set('!=', {}, ['value', 'test']),

  isLess: ops.set('<', {}, ['value', 'test']),

  isLessOrEqual: ops.set('<=', {}, ['value', 'test']),

  isGreater: ops.set('>', {}, ['value', 'test']),

  isGreaterOrEqual: ops.set('>=', {}, ['value', 'test']),

  // Casts
  
  asAny: ops.set('~' + ID.Any, {}, ['value']),

  asBoolean: ops.set('~' + ID.Boolean, {}, ['value']),

  asColor: ops.set('~' + ID.Color, {}, ['value']),

  asDate: ops.set('~' + ID.Date, {}, ['value']),

  asList: ops.set('~' + ID.List, {}, ['value']),

  asMap: ops.set('~' + ID.Map, {}, ['value']),

  asNumber: ops.set('~' + ID.Number, {}, ['value']),

  asObject: ops.set('~' + ID.Object, {}, ['value']),

  asText: ops.set('~' + ID.Text, {}, ['value']),

  asTuple: ops.set('~' + ID.Tuple, {}, ['value']),

};

TupleComputeds.set('copy', TupleOps.copy);