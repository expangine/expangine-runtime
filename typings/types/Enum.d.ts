import { Type, TypeDescribeProvider, TypeProvider } from '../Type';
import { Operations } from '../Operation';
export interface EnumOptions {
    key: Type;
    value: Type;
    constants: Map<any, any>;
}
export declare class EnumType extends Type<EnumOptions> {
    static id: string;
    static operations: Operations;
    static baseType: EnumType;
    static decode(data: any[], types: TypeProvider): EnumType;
    static encode(type: EnumType): any;
    static describePriority: number;
    static describe(): Type | null;
    getId(): string;
    getOperations(): Record<string, import("../Operation").Operation<any, any, any>>;
    merge(type: EnumType, describer: TypeDescribeProvider): void;
    getSubTypes(): {
        key: Type<any>;
        value: Type<any>;
    };
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(test: any): boolean;
    normalize(value: any): any;
    newInstance(): EnumType;
    clone(): EnumType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
