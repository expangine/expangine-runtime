
import { AliasedType } from '../../types/Aliased';
import { AliasedOps } from '../AliasedOps';
import { Types } from '../../TypeBuilder';
import { EnumType } from '../../types/Enum';
import { objectToArray } from '../../fns';
import { OperationTypeInput } from '../../Operation';
import { ObjectType } from '../../types/Object';

const ops = AliasedType.operations;

const GetNamedType: OperationTypeInput<'name'> = (i, defs) =>  
  i.name instanceof EnumType
    ? defs.aliased[i.name.options.constants.keys().next().value] || ObjectType.baseType
    : ObjectType.baseType;

const GetName: OperationTypeInput<'name'> = (i, defs) => 
  i.name instanceof EnumType
    ? i.name
    : Types.many(objectToArray(defs.aliased, (_, name) => Types.enumForText([name, name])));

export const AliasedOpsTypes = 
{

  newInstance: ops.setTypes(AliasedOps.newInstance, 
    GetNamedType,
    { name: GetName }
  ),

};

AliasedOpsTypes.newInstance.rawTypes = true;
