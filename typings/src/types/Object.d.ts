import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
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
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    merge(type: ObjectType, describer: TypeDescribeProvider): void;
    getSubTypes(): Record<string, Type<any>>;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
}
