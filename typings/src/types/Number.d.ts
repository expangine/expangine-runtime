import { Type } from '../Type';
import { Operations } from '../Operation';
export interface NumberOptions {
    min?: number;
    max?: number;
    whole?: boolean;
}
export declare class NumberType extends Type<NumberOptions> {
    static id: string;
    static operations: Operations<NumberType>;
    static baseType: NumberType;
    static decode(data: any[]): NumberType;
    static encode(type: NumberType): any;
    getSubTypes(): null;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
}
