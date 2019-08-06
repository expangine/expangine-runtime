import { Type, TypeProvider } from '../Type';
import { Operations } from '../Operation';
export interface ObjectOptions {
    props: Record<string, Type>;
}
export declare class ObjectType extends Type<ObjectOptions> {
    static id: string;
    static operations: Operations<ObjectType>;
    static baseType: ObjectType;
    static decode(data: any[], types: TypeProvider): ObjectType;
    static encode(type: ObjectType): any;
    getSubTypes(): Record<string, Type<any>>;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
}
