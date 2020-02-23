
import { Type, TypeMap } from '../../Type';
import { ObjectType } from '../../types/Object';
import { NumberType } from '../../types/Number';
import { BooleanType } from '../../types/Boolean';
import { TextType } from '../../types/Text';
import { AnyType } from '../../types/Any';

import { ObjectOps } from '../ObjectOps';
import { DateType } from '../../types/Date';
import { ListType } from '../../types/List';
import { MapType } from '../../types/Map';
import { TupleType } from '../../types/Tuple';
import { OptionalType } from '../../types/Optional';
import { ColorType } from '../../types/Color';
import { SetType } from '../../types/Set';
import { EntityType } from '../../types/Entity';
import { Types } from '../../Types';


const ops = ObjectType.operations;
const GivenObject = (i: {object?: Type}) => i.object || ObjectType;

export const ObjectOpsTypes = 
{

  // Static

  create: ops.setTypes(ObjectOps.create, 
    GivenObject
  ),

  // Operations

  maybe: ops.setTypes(ObjectOps.maybe, 
    (i, defs) => Types.maybe(i.value, ObjectType),
    { value: AnyType } 
  ),

  has: ops.setTypes(ObjectOps.has, 
    BooleanType,
    { object: GivenObject, key: TextType }
  ),

  get: ops.setTypes(ObjectOps.get, 
    AnyType,
    { object: GivenObject, key: TextType }
  ),

  set: ops.setTypes(ObjectOps.set, 
    GivenObject,
    { object: GivenObject, key: TextType, value: AnyType },
    {},
    { existingValue: AnyType }
  ),

  delete: ops.setTypes(ObjectOps.delete, 
    AnyType,
    { object: GivenObject, key: TextType }
  ),

  cmp: ops.setTypes(ObjectOps.cmp, 
    NumberType,
    { value: ObjectType, test: ObjectType }
  ),

  copy: ops.setTypes(ObjectOps.copy, 
    GivenObject,
    { object: GivenObject }
  ),

  merge: ops.setTypes(ObjectOps.merge, 
    (i, defs) => {
      const props: TypeMap = {};
      const params: Array<keyof typeof i> = ['a', 'b', 'c', 'd', 'e'];

      for (const param of params) 
      {
        let paramType = i[param];

        if (paramType instanceof EntityType)
        {
          paramType = paramType.getType();
        }

        if (paramType instanceof ObjectType) 
        {
          const paramProps = paramType.options.props;

          for (const prop in paramProps) 
          {
            const paramProp = paramProps[prop];

            if (prop in props && paramProp instanceof OptionalType) 
            {
              props[prop] = Types.mergeMany([paramProp, props[prop]]);
            } 
            else 
            {
              props[prop] = paramProp;
            }
          }
        }
      }

      return new ObjectType({ props });
    },
    { a: ObjectType, b: ObjectType },
    { c: ObjectType, d: ObjectType, e: ObjectType }
  ),

  // Comparisons

  isValid: ops.setTypes(ObjectOps.isValid, 
    BooleanType, 
    { value: AnyType }
  ),

  isEqual: ops.setTypes(ObjectOps.isEqual, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  isNotEqual: ops.setTypes(ObjectOps.isNotEqual, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  isLess: ops.setTypes(ObjectOps.isLess, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  isLessOrEqual: ops.setTypes(ObjectOps.isLessOrEqual, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  isGreater: ops.setTypes(ObjectOps.isGreater, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  isGreaterOrEqual: ops.setTypes(ObjectOps.isGreaterOrEqual, 
    BooleanType,
    { value: ObjectType, test: ObjectType }
  ),

  // Casts

  asAny: ops.setTypes(ObjectOps.asAny, AnyType, { value: ObjectType }),

  asBoolean: ops.setTypes(ObjectOps.asBoolean, BooleanType, { value: ObjectType }),

  asColor: ops.setTypes(ObjectOps.asColor, ColorType, { value: ObjectType }),

  asDate: ops.setTypes(ObjectOps.asDate, DateType, { value: ObjectType }),

  asList: ops.setTypes(ObjectOps.asList, i => ListType.forItem(i.value || ObjectType), { value: ObjectType }),

  asMap: ops.setTypes(ObjectOps.asMap, i => MapType.forItem(i.value || ObjectType), { value: ObjectType }),

  asNumber: ops.setTypes(ObjectOps.asNumber, NumberType, { value: ObjectType }),

  asObject: ops.setTypes(ObjectOps.asObject, i => i.value || ObjectType, { value: ObjectType }),

  asText: ops.setTypes(ObjectOps.asText, TextType, { value: ObjectType }),

  asTuple: ops.setTypes(ObjectOps.asTuple, i => TupleType.forItem([i.value || ObjectType]), { value: ObjectType }),

  asSet: ops.setTypes(ObjectOps.asSet, i => SetType.forItem(i.value || ObjectType), { value: ObjectType }),

};
