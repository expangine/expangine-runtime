import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
export interface DateOptions {
    parseAsUTC?: boolean;
}
export declare class DateType extends Type<DateOptions> {
    static id: string;
    static operations: Operations<DateType>;
    static baseType: DateType;
    static decode(data: any[], types: TypeProvider): DateType;
    static encode(type: DateType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    merge(type: DateType, describer: TypeDescribeProvider): void;
    getSubTypes(): null;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
}
