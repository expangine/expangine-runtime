import { Type, TypeInput, TypeMap } from "../../Type";
import { ObjectType } from "../../types/Object";
import { EntityType } from "../../types/Entity";
import { EnumType } from "../../types/Enum";
import { ManyType } from "../../types/Many";
import { Types } from "../../Types";
import { OptionalType } from "../../types/Optional";



export function MergedObjectType(types: Type[]): ObjectType
{
    const props: TypeMap = {};

    for (const type of types) 
    {
        const objectType = GivenObjectType(type, undefined, MergedObjectType);
        
        if (objectType instanceof ObjectType) 
        {
            const paramProps = objectType.options.props;

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
}

export function GivenObjectType(type?: Type, otherwise?: TypeInput, merger?: (multiple: Type[]) => Type): TypeInput
{
    return type instanceof ObjectType 
        ? type 
        : type instanceof EntityType 
            ? type.getType()
            : type instanceof EnumType
                ? GivenObjectType(type.options.value, otherwise)
                : type instanceof ManyType && type.options.some((e) => GivenObjectType(e)) && merger
                    ? merger(type.options.filter((e) => GivenObjectType(e)))
                    : type instanceof OptionalType
                        ? GivenObjectType(type.options, otherwise)
                        : otherwise;
}
  