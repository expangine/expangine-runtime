import { Type, TypeInput } from "../../Type";
import { ObjectType } from "../../types/Object";
export declare function MergedObjectType(types: Type[]): ObjectType;
export declare function GivenObjectType(type?: Type, otherwise?: TypeInput, merger?: (multiple: Type[]) => Type): TypeInput;
