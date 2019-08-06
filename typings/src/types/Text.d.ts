import { Type } from '../Type';
import { Operations } from '../Operation';
export interface TextOptions {
    min?: number;
    max?: number;
    requireUpper?: boolean;
    requireLower?: boolean;
    forceUpper?: boolean;
    forceLower?: boolean;
    matches?: RegExp;
}
export declare class TextType extends Type<TextOptions> {
    static id: string;
    static operations: Operations<TextType>;
    static baseType: TextType;
    static decode(data: any[]): TextType;
    static encode(type: TextType): any;
    getSubTypes(): null;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
}
