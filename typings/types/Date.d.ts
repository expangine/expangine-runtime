import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { Unit } from '../util/DateFunctions';
export interface DateOptions {
    parseAsUTC?: boolean;
    validateMin?: Date;
    validateMax?: Date;
    forceMin?: Date;
    forceMax?: Date;
    forceStartOf?: Unit;
    forceEndOf?: Unit;
    withTime?: boolean;
}
export declare class DateType extends Type<DateOptions> {
    static id: string;
    static operations: Operations;
    static baseType: DateType;
    static decode(data: any[], types: TypeProvider): DateType;
    static encode(type: DateType): any;
    private static decodeOptions;
    private static encodeOptions;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    getId(): string;
    getOperations(): Record<string, import("../Operation").Operation<any, any, any>>;
    merge(type: DateType, describer: TypeDescribeProvider): void;
    getSubTypes(): null;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): DateType;
    clone(): DateType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: string): Date;
    toJson(value: Date): string;
}
