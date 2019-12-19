
import { Operations } from '../Operation';
import { ID } from '../types/ID';
import { Computeds } from '../Computed';


export const SetOperations = new Operations(ID.Set + ID.Delimiter);

export const SetComputeds = new Computeds(ID.Set + ID.Delimiter);

const ops = SetOperations;

export const SetOps = 
{

  // Static

  create: ops.set('create'),

  // Operations

  maybe: ops.set('maybe', {}, ['value']),

  add: ops.set('add', { mutates: ['set'] }, ['set', 'value'], [], [], [], ['set']),

  has: ops.set('has', {}, ['set', 'value']),

  delete: ops.set('delete', { mutates: ['set'] }, ['set', 'value']),

  values: ops.set('values', { complexity: 1 }, ['set'], [], [], [], ['set']),

  clear: ops.set('clear', { mutates: ['set'] }, ['set'], [], [], [], ['set']),

  count: ops.set('count', { }, ['set']),

  cmp: ops.set('cmp', { complexity: 1 }, ['value', 'test']),

  copy: ops.set('copy', { complexity: 1 }, ['set'], ['deepCopy'], ['set', 'value'], ['deepCopy'], ['set']),

  map: ops.set('map', { complexity: 1 }, ['set'], ['transform'], ['set', 'value'], ['transform'], ['set']),

  // Comparisons

  isValid: ops.set('?', {}, ['value']),

  isEqual: ops.set('=', { complexity: 1 }, ['value', 'test']),

  isNotEqual: ops.set('!=', { complexity: 1 }, ['value', 'test']),

  isLess: ops.set('<', { complexity: 1 }, ['value', 'test']),

  isLessOrEqual: ops.set('<=', { complexity: 1 }, ['value', 'test']),

  isGreater: ops.set('>', { complexity: 1 }, ['value', 'test']),

  isGreaterOrEqual: ops.set('>=', { complexity: 1 }, ['value', 'test']),

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

  asSet: ops.set('~' + ID.Set, {}, ['value']),

};

SetComputeds.set('copy', SetOps.copy);
SetComputeds.set('values', SetOps.values);
SetComputeds.set('count', SetOps.count);