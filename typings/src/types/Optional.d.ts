import { Type, TypeProvider, TypeClass, TypeDescribeProvider } from '../Type';
import { Operations, Operation } from '../Operation';
export declare class OptionalType extends Type<Type> {
    static id: string;
    static operations: Operations<OptionalType>;
    static baseType: OptionalType;
    static decode(data: any[], types: TypeProvider): OptionalType;
    static encode(type: OptionalType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    getOperations(type: TypeClass<any, any>): Record<string, Operation>;
    merge(type: OptionalType, describer: TypeDescribeProvider): void;
    getSubTypes(): Record<string, Type<any>>;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
}
