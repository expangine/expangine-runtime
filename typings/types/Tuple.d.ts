import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
export declare class TupleType extends Type<Type[]> {
    static id: string;
    static operations: Operations<TupleType>;
    static baseType: TupleType;
    static decode(data: any[], types: TypeProvider): TupleType;
    static encode(type: TupleType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    subs?: Record<string, Type>;
    getId(): string;
    merge(type: TupleType, describer: TypeDescribeProvider): void;
    getSubTypes(): Record<string, Type<any>>;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
}
