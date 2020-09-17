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
export interface DataTypeAccessor<T = any> {
    priority: number;
    isValid(value: any, step: any): boolean;
    set(value: T, step: any, stepValue: any): void;
    get(value: T, step: any): any;
    remove(value: T, step: any): any;
    has(value: T, step: any): any;
}
export interface DataTypeRegistryOperations {
    objectSet<O extends object, K extends keyof O>(obj: O, prop: K, value: O[K]): void;
    objectRemove<O extends object, K extends keyof O>(obj: O, prop: K): void;
    arrayAdd<T>(arr: T[], item: T): void;
    arrayRemove<T>(arr: T[], index: number): T;
    arraySet<T>(arr: T[], index: number, item: T): T;
}
export declare class DataTypeRegistry implements DataTypeRegistryOperations {
    static TYPES: DataTypeRaw[];
    private compareTypes;
    private compareMap;
    private equalsMap;
    private copyList;
    private jsonList;
    private accessorList;
    objectSet: DataTypeRegistryOperations['objectSet'];
    objectRemove: DataTypeRegistryOperations['objectRemove'];
    arrayAdd: DataTypeRegistryOperations['arrayAdd'];
    arrayRemove: DataTypeRegistryOperations['arrayRemove'];
    arraySet: DataTypeRegistryOperations['arraySet'];
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
    get(value: any, step: any): any;
    set(value: any, step: any, stepValue: any): boolean;
    remove(value: any, step: any): boolean;
    has<O = false>(value: any, step: any, defaultResult?: O): boolean | O;
    addAccessor<T>(accessor: DataTypeAccessor<T>): this;
    private createTypeMap;
    private addToPriorityList;
}
export declare const DataTypes: DataTypeRegistry;
