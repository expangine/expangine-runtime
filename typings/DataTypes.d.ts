export declare type DataTypeRaw = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
export interface DataTypeComparator {
    priority: number;
    type: DataTypeRaw;
    compare(a: any, b: any, compare: (a: any, b: any) => number): number | undefined;
}
export interface DataTypeEquality {
    priority: number;
    type: DataTypeRaw;
    equals(a: any, b: any, equals: (a: any, b: any) => boolean): boolean | undefined;
}
export interface DataTypeCopier {
    priority: number;
    copy(a: any, copier: (b: any) => any, setObjectCopy: (original: any, copy: any) => void): any | undefined;
}
export interface DataTypeJson<T = any> {
    priority: number;
    toJson(value: T, toJson: (value: any) => any): any | undefined;
    fromJson(json: any, fromJson: (json: any) => any): T;
}
export declare enum CycleOption {
    IGNORE = 0,
    ERROR = 1,
    ATTEMPT = 2
}
export declare class DataTypeRegistry {
    static TYPES: DataTypeRaw[];
    private compareTypes;
    private compareMap;
    private equalsMap;
    private copyList;
    private jsonList;
    constructor();
    compare(a: any, b: any): number;
    getCompare(less: number, more: number): number;
    addCompare(compare: DataTypeComparator): this;
    equals(a: any, b: any): boolean;
    addEquals(equals: DataTypeEquality): this;
    copy<T>(x: T, containsCycles?: boolean): T;
    addCopier(copier: DataTypeCopier): this;
    toJson<T>(value: T): any;
    fromJson<T>(json: any): T;
    addJson<T>(json: DataTypeJson<T>): this;
    private createTypeMap;
    private addToPriorityList;
}
export declare const DataTypes: DataTypeRegistry;
