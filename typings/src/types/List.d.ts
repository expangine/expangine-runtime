import { Type, TypeProvider, TypeClass } from '../Type';
import { Operations } from '../Operation';
import { NumberType } from './Number';
export interface ListOptions {
    item: Type;
    min?: number;
    max?: number;
}
export declare class ListType extends Type<ListOptions> {
    static lengthType: NumberType;
    static id: string;
    static operations: Operations<ListType>;
    static baseType: ListType;
    static decode(data: any[], types: TypeProvider): ListType;
    static encode(type: ListType): any;
    static forItem(itemOrClass: Type | TypeClass<any, any>): ListType;
    getSubTypes(): {
        length: NumberType;
        item: Type<any>;
    };
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
}
