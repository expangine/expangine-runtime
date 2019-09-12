import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
export declare class OptionalType extends Type<Type> {
    static id: string;
    static operations: Operations;
    static baseType: OptionalType;
    static decode(data: any[], types: TypeProvider): OptionalType;
    static encode(type: OptionalType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    getOperations(): Record<string, import("../Operation").Operation<any, any, any>>;
    getId(): string;
    merge(type: OptionalType, describer: TypeDescribeProvider): void;
    getSubTypes(): Record<string, Type<any>>;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): OptionalType;
    clone(): OptionalType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
