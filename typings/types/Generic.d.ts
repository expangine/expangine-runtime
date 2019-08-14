import { Type, TypeProvider, TypeClass, TypeDescribeProvider } from '../Type';
import { Operations, Operation } from '../Operation';
export declare class GenericType extends Type<string> {
    static id: string;
    static operations: Operations<GenericType>;
    static baseType: GenericType;
    static decode(data: any[], types: TypeProvider): GenericType;
    static encode(type: GenericType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    inferredType?: Type;
    getOperations(type: TypeClass<any, any>): Record<string, Operation>;
    getId(): string;
    merge(type: GenericType, describer: TypeDescribeProvider): void;
    getSubTypes(): Record<string, Type<any>>;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
}
