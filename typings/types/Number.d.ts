import { Type, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
export interface NumberOptions {
    min?: number;
    max?: number;
    whole?: boolean;
}
export declare class NumberType extends Type<NumberOptions> {
    static WHOLE_EPSILON: number;
    static id: string;
    static operations: Operations<NumberType>;
    static baseType: NumberType;
    static decode(data: any[]): NumberType;
    static encode(type: NumberType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    getId(): string;
    merge(type: NumberType, describer: TypeDescribeProvider): void;
    getSubTypes(): null;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
    create(): number;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: number): number;
    toJson(value: number): number;
}
