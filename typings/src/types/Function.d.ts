import { Type, TypeProvider } from '../Type';
import { Operations } from '../Operation';
import { ObjectType } from './Object';
export interface FunctionOptions {
    returnType: Type;
    params: ObjectType;
}
export declare class FunctionType extends Type<FunctionOptions> {
    static id: string;
    static operations: Operations<FunctionType>;
    static baseType: FunctionType;
    static decode(data: any[], types: TypeProvider): FunctionType;
    static encode(type: FunctionType): any;
    getSubTypes(): {
        returnType: Type<any>;
        params: ObjectType;
    };
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
}
