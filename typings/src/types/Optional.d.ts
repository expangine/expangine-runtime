import { Type, TypeProvider } from '../Type';
import { Operations } from '../Operation';
export declare class OptionalType extends Type<Type> {
    static id: string;
    static operations: Operations<OptionalType>;
    static baseType: OptionalType;
    static decode(data: any[], types: TypeProvider): OptionalType;
    static encode(type: OptionalType): any;
    getSubTypes(): Record<string, Type<any>>;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
}
