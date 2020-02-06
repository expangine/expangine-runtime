
import { Operations } from '../Operation';
import { ID } from '../types/ID';
import { Computeds } from '../Computed';


export const AliasedOperations = new Operations(ID.Aliased + ID.Delimiter);

export const AliasedComputeds = new Computeds(ID.Aliased + ID.Delimiter);

const ops = AliasedOperations;

export const AliasedOps = 
{

  newInstance: ops.set('newInstance', {}, ['name'], [], [], [], ['name']),

  // save: ops.set('create', {}, ['name', 'instance']),

  // remove: ops.set('remove', {}, ['name', 'instance']),

};
