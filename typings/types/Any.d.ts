import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
export declare class AnyType extends Type {
    static id: string;
    static operations: Operations;
    static baseType: AnyType;
    static decode(data: any[], types: TypeProvider): AnyType;
    static encode(type: AnyType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    getId(): string;
    getOperations(): Record<string, import("../Operation").Operation<any, any, any>>;
    merge(type: AnyType, describer: TypeDescribeProvider): void;
    getSubTypes(): null;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): AnyType;
    clone(): AnyType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
