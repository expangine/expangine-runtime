
import { Operations } from '../Operation';
import { ID } from '../types/ID';


export const ObjectOperations = new Operations(ID.Object + ':');

const ops = ObjectOperations;

export const ObjectOps = 
{

  // Static

  create: ops.set('create'),

  // Operations

  maybe: ops.set('maybe', {}, ['value']),

  has: ops.set('has', {}, ['object', 'key']),

  get: ops.set('get', {}, ['object', 'key']),

  set: ops.set('set', { mutates: ['object'] }, ['object', 'key', 'value'], [], ['existingValue'], [], ['object']),

  delete: ops.set('del', { mutates: ['object'] }, ['object', 'key']),

  cmp: ops.set('cmp', {}, ['value', 'test']),

  copy: ops.set('copy', {}, ['object'], [], [], [], ['object']),

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

  asDate: ops.set('~' + ID.Date, {}, ['value']),

  asList: ops.set('~' + ID.List, {}, ['value']),

  asMap: ops.set('~' + ID.Map, {}, ['value']),

  asNumber: ops.set('~' + ID.Number, {}, ['value']),

  asObject: ops.set('~' + ID.Object, {}, ['value']),

  asText: ops.set('~' + ID.Text, {}, ['value']),

  asTuple: ops.set('~' + ID.Tuple, {}, ['value']),

};
