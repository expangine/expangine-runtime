import { Operation, Operations } from './Operation';
export declare type TypeInput = TypeClass | Type;
export declare type TypeMap = Record<string, TypeInput>;
export declare type TypeMapStrict = Record<string, Type>;
export declare type TypeResolved<T> = T extends (null | undefined) ? undefined : T extends TypeInput ? Type : T extends TypeInput[] ? Type[] : T extends TypeMap ? Record<keyof T, Type> : {
    [K in keyof T]: TypeResolved<T[K]>;
};
export interface TypeProvider {
    getType(data: any): Type;
}
export interface TypeDescribeProvider {
    describe(data: any): Type;
    merge(type: Type, data: any): Type;
    mergeType(type: Type, other: Type): Type;
    optionalType(type: Type): Type;
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
    describePriority: number;
    describe(this: TypeClass<T>, data: any, describer: TypeDescribeProvider): Type | null;
    new (options: O): T;
}
export declare abstract class Type<O = any> {
    static fromInput(input: TypeInput): Type;
    static resolve<T>(types: T): TypeResolved<T>;
    options: O;
    operations?: Record<string, Operation>;
    constructor(options: O);
    getOperations(type: TypeClass<any, O>): Record<string, Operation>;
    abstract merge(type: Type<O>, describer: TypeDescribeProvider): void;
    abstract getSubTypes(): Record<string, Type> | null;
    abstract getExactType(value: any): Type<O>;
    abstract isCompatible(other: Type<O>): boolean;
    abstract isValid(value: any): boolean;
    abstract normalize(value: any): any;
    abstract encode(): any;
    abstract random(rnd: (a: number, b: number, whole: boolean) => number): any;
}
