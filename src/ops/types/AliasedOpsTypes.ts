
import { AliasedType } from '../../types/Aliased';
import { AliasedOps } from '../AliasedOps';
import { Types } from '../../TypeBuilder';
import { objectValues, isArray } from '../../fns';
import { OperationTypeInput } from '../../Operation';
import { ObjectType } from '../../types/Object';
import { BooleanType } from '../../types/Boolean';
import { NumberType } from '../../types/Number';
import { AnyType } from '../../types/Any';
import { EnumType } from '../../types/Enum';
import { NullType } from '../../types/Null';
import { TextType } from '../../types/Text';
import { Type } from '../../Type';
import { TypeRelation } from '../../Relation';
import { Definitions } from '../../Definitions';

const ops = AliasedType.operations;

const GetNamedType: OperationTypeInput<'name'> = (i, defs) => 
  i.name instanceof AliasedType
    ? i.name
    : ObjectType.baseType;

const GetName: OperationTypeInput<'name'> = (i, defs) => 
  i.name instanceof AliasedType
    ? i.name
    : Types.many(objectValues(defs.aliased));

const GetTypeRelation = (i: {name?: Type, relation?: Type}, defs: Definitions): TypeRelation | TypeRelation[] | null => {
  if (!(i.name instanceof AliasedType)) {
    return null;
  }

  const relations = defs.getRelations(i.name.options);

  if (i.relation instanceof EnumType) {
    const relationName = i.relation.options.constants.get('relation');

    if (relationName) {
      const match = relations.find((r) => r.name === relationName);

      if (match) {
        return match;
      }
    }
  }

  return relations;
};

const GetRelation: OperationTypeInput<'name' | 'relation'> = (i, defs) => {
  const typeRelation = GetTypeRelation(i, defs);

  if (typeRelation === null) {
    return NullType.baseType;
  } else if (isArray(typeRelation)) {
    return Types.many(
      typeRelation.map((relation) => Types.enum(
        TextType,
        TextType,
        [['relation', relation.name]],
      ))
    );
  } else {
    return i.relation;
  }
};

const GetRelatedRelationType: OperationTypeInput<'name' | 'relation' | 'related'> = (i, defs) => {
  const typeRelation = GetTypeRelation(i, defs);

  if (typeRelation !== null && !isArray(typeRelation)) {
    if (i.related && typeRelation.relationType.acceptsType(i.related)) {
      return i.related;
    }
    
    return typeRelation.relationType;
  }

  return NullType.baseType;
};

const GetRelatedItemType: OperationTypeInput<'name' | 'relation' | 'related'> = (i, defs) => {
  const typeRelation = GetTypeRelation(i, defs);

  if (typeRelation !== null && !isArray(typeRelation)) {
    if (i.related && typeRelation.itemType.acceptsType(i.related)) {
      return i.related;
    }
    
    return typeRelation.itemType;
  }

  return NullType.baseType;
};


export const AliasedOpsTypes = 
{

  newInstance: ops.setTypes(AliasedOps.newInstance, 
    GetNamedType,
    { name: GetName }
  ),

  getKey: ops.setTypes(AliasedOps.getKey,
    (i, defs) => {
      if (!(i.name instanceof AliasedType)) {
        return AnyType;
      }
      const storage = defs.storage[i.name.options];
      if (!storage || !storage.key) {
        return AnyType;
      }

      return storage.getKeyReturnType(defs);
    },
    { name: GetName, instance: GetNamedType }
  ),

  save: ops.setTypes(AliasedOps.save, 
    BooleanType,
    { name: GetName, instance: GetNamedType }
  ),

  remove: ops.setTypes(AliasedOps.remove, 
    BooleanType,
    { name: GetName, instance: GetNamedType }
  ),

  setRelated: ops.setTypes(AliasedOps.setRelated, 
    NumberType,
    { name: GetName, instance: GetNamedType, relation: GetRelation, related: GetRelatedRelationType }
  ),

  addRelated: ops.setTypes(AliasedOps.addRelated, 
    NumberType,
    { name: GetName, instance: GetNamedType, relation: GetRelation, related: GetRelatedItemType } 
  ),

  removeRelated: ops.setTypes(AliasedOps.removeRelated, 
    NumberType,
    { name: GetName, instance: GetNamedType, relation: GetRelation, related: GetRelatedItemType } 
  ),

  clearRelated: ops.setTypes(AliasedOps.clearRelated, 
    NumberType,
    { name: GetName, instance: GetNamedType, relation: GetRelation } 
  ),

  getRelated: ops.setTypes(AliasedOps.getRelated,
    (i, defs) => GetRelatedRelationType(i, defs),
    { name: GetName, instance: GetNamedType, relation: GetRelation }
  ),

  isRelated: ops.setTypes(AliasedOps.isRelated, 
    NumberType,
    { name: GetName, instance: GetNamedType, relation: GetRelation, related: GetRelatedItemType } 
  ),

};

AliasedOpsTypes.newInstance.rawTypes = true;
AliasedOpsTypes.getKey.rawTypes = true;
AliasedOpsTypes.save.rawTypes = true;
AliasedOpsTypes.remove.rawTypes = true;
AliasedOpsTypes.setRelated.rawTypes = true;
AliasedOpsTypes.addRelated.rawTypes = true;
AliasedOpsTypes.removeRelated.rawTypes = true;
AliasedOpsTypes.clearRelated.rawTypes = true;
AliasedOpsTypes.getRelated.rawTypes = true;
AliasedOpsTypes.isRelated.rawTypes = true;
