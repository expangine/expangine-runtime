import { Operation, Operations } from './Operation';
export declare type TypeInput = TypeClass | Type;
export declare type TypeMap = Record<string, TypeInput>;
export interface TypeProvider {
    getType(data: any): Type;
}
export interface TypeParser {
    (data: any, types: TypeProvider): Type;
}
export interface TypeClass<T extends Type<O> = any, O = any> {
    id: string;
    operations: Operations<T>;
    baseType: T;
    decode(this: TypeClass<T>, data: any[], types: TypeProvider): T;
    encode(this: TypeClass<T>, type: T): any;
    new (options: O): T;
}
export declare abstract class Type<O = any> {
    static fromInput(input: TypeInput): Type;
    options: O;
    operations?: Record<string, Operation>;
    constructor(options: O);
    getOperations(type: TypeClass<any, O>): Record<string, Operation>;
    abstract getSubTypes(): Record<string, Type> | null;
    abstract getExactType(value: any): Type<O>;
    abstract isCompatible(other: Type<O>): boolean;
    abstract isValid(value: any): boolean;
    abstract normalize(value: any): any;
    abstract encode(): any;
}
