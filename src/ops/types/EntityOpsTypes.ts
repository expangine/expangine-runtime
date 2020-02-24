
import { EntityType } from '../../types/Entity';
import { EntityOps } from '../EntityOps';
import { Types } from '../../Types';
import { objectValues, isArray } from '../../fns';
import { OperationTypeInput, OperationTypeProvider } from '../../Operation';
import { ObjectType } from '../../types/Object';
import { BooleanType } from '../../types/Boolean';
import { NumberType } from '../../types/Number';
import { AnyType } from '../../types/Any';
import { EnumType } from '../../types/Enum';
import { NullType } from '../../types/Null';
import { TextType } from '../../types/Text';
import { Type } from '../../Type';
import { EntityRelation } from '../../Relation';

const ops = EntityType.operations;

const GetNamedType: OperationTypeInput<'name'> = (i, defs) => 
  i.name instanceof EntityType
    ? i.name
    : ObjectType.baseType;

const GetName: OperationTypeInput<'name'> = (i, defs) => 
  i.name instanceof EntityType
    ? i.name
    : Types.many(objectValues(defs.getEntities()));

const GetTypeRelation = (i: {name?: Type, relation?: Type}, provider: OperationTypeProvider): EntityRelation | EntityRelation[] | null => {
  if (!(i.name instanceof EntityType)) {
    return null;
  }

  const relations = provider.getRelations(i.name.options);

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

const GetRelation: OperationTypeInput<'name' | 'relation'> = (i, provider) => {
  const typeRelation = GetTypeRelation(i, provider);

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

const GetRelatedItemType: OperationTypeInput<'name' | 'relation' | 'related'> = (i, provider) => {
  const typeRelation = GetTypeRelation(i, provider);

  if (typeRelation !== null && !isArray(typeRelation)) {
    if (i.related && typeRelation.itemType.acceptsType(i.related)) {
      return i.related;
    }
    
    return typeRelation.itemType;
  }

  return NullType.baseType;
};


export const EntityOpsTypes = 
{

  newInstance: ops.setTypes(EntityOps.newInstance, 
    GetNamedType,
    { name: GetName }
  ),

  getKey: ops.setTypes(EntityOps.getKey,
    (i, provider) => {
      if (!(i.name instanceof EntityType)) {
        return AnyType;
      }
      const entity = provider.getEntity(i.name.options);
      if (!entity || !entity.key) {
        return AnyType;
      }

      return entity.keyType;
    },
    { name: GetName, instance: GetNamedType }
  ),

  save: ops.setTypes(EntityOps.save, 
    BooleanType,
    { name: GetName, instance: GetNamedType }
  ),

  remove: ops.setTypes(EntityOps.remove, 
    BooleanType,
    { name: GetName, instance: GetNamedType }
  ),

  setRelated: ops.setTypes(EntityOps.setRelated, 
    NumberType,
    { name: GetName, instance: GetNamedType, relation: GetRelation, related: GetRelatedRelationType }
  ),

  addRelated: ops.setTypes(EntityOps.addRelated, 
    NumberType,
    { name: GetName, instance: GetNamedType, relation: GetRelation, related: GetRelatedItemType } 
  ),

  removeRelated: ops.setTypes(EntityOps.removeRelated, 
    NumberType,
    { name: GetName, instance: GetNamedType, relation: GetRelation, related: GetRelatedItemType } 
  ),

  clearRelated: ops.setTypes(EntityOps.clearRelated, 
    NumberType,
    { name: GetName, instance: GetNamedType, relation: GetRelation } 
  ),

  getRelated: ops.setTypes(EntityOps.getRelated,
    (i, defs) => GetRelatedRelationType(i, defs),
    { name: GetName, instance: GetNamedType, relation: GetRelation }
  ),

  isRelated: ops.setTypes(EntityOps.isRelated, 
    NumberType,
    { name: GetName, instance: GetNamedType, relation: GetRelation, related: GetRelatedItemType } 
  ),

};

EntityOpsTypes.newInstance.rawTypes = true;
EntityOpsTypes.getKey.rawTypes = true;
EntityOpsTypes.save.rawTypes = true;
EntityOpsTypes.remove.rawTypes = true;
EntityOpsTypes.setRelated.rawTypes = true;
EntityOpsTypes.addRelated.rawTypes = true;
EntityOpsTypes.removeRelated.rawTypes = true;
EntityOpsTypes.clearRelated.rawTypes = true;
EntityOpsTypes.getRelated.rawTypes = true;
EntityOpsTypes.isRelated.rawTypes = true;
