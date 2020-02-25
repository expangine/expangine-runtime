
import { Operations } from '../Operation';
import { ID } from '../types/ID';
import { Computeds } from '../Computed';


export const EntityOperations = new Operations(ID.Entity + ID.Delimiter);

export const EntityComputeds = new Computeds(ID.Entity + ID.Delimiter);

const ops = EntityOperations;

export const EntityOps = 
{

  newInstance: ops.set('newInstance', {}, ['name'], [], [], [], ['name']),

  get: ops.set('get', {}, ['name'], ['where'], ['instance'], ['where'], ['name']),

  getKey: ops.set('getKey', {}, ['name', 'instance'], [], [], [], ['name']),

  save: ops.set('save', { mutates: ['instance'] }, ['name', 'instance'], [], [], [], ['name']),

  remove: ops.set('remove', { mutates: ['instance'] }, ['name', 'instance'], [], [], [], ['name']),

  setRelated: ops.set('setRelated', { complexity: 1, mutates: ['instance', 'related']  }, ['name', 'instance', 'relation', 'related'], [], [], [], ['name', 'relation']),

  addRelated: ops.set('addRelated', { mutates: ['instance', 'related'] }, ['name', 'instance', 'relation', 'related'], [], [], [], ['name', 'relation']),

  removeRelated: ops.set('removeRelated', { mutates: ['instance', 'related'] }, ['name', 'instance', 'relation', 'related'], [], [], [], ['name', 'relation']),

  clearRelated: ops.set('clearRelated', { complexity: 1, mutates: ['instance'] }, ['name', 'instance', 'relation'], [], [], [], ['name', 'relation']),

  getRelated: ops.set('getRelated', { complexity: 1 }, ['name', 'instance', 'relation'], [], [], [], ['name', 'relation']),

  isRelated: ops.set('isRelated', {}, ['name', 'instance', 'relation', 'related'], [], [], [], ['name', 'relation']),

};
