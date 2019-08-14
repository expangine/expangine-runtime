import { Type, TypeProvider, TypeInput, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { NumberType } from './Number';
import { ObjectType } from './Object';
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
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static forItem(itemOrClass: TypeInput): ListType;
    getId(): string;
    merge(type: ListType, describer: TypeDescribeProvider): void;
    getSubTypes(): {
        length: NumberType;
        item: Type<any>;
    };
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    getSplitResultType(): ObjectType;
    getIterationScope(): {
        list: ListType;
        item: Type<any>;
        index: NumberType;
    };
    static readonly IterationScopeDefaults: {
        list: string;
        item: string;
        index: string;
    };
    getCompareScope(): {
        list: ListType;
        value: Type<any>;
        test: Type<any>;
    };
    static readonly CompareScopeDefaults: {
        list: string;
        value: string;
        test: string;
    };
}
