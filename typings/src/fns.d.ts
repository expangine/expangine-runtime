export declare function isNumber(value: any): value is number;
export declare function isString(value: any): value is string;
export declare function isArray<T = any>(value: any): value is T[];
export declare function isDate(value: any): value is Date;
export declare function isMap<K, V>(value: any): value is Map<K, V>;
export declare function isBoolean(value: any): value is boolean;
export declare function isFunction(value: any): value is ((...args: any[]) => any);
export declare function isObject(value: any): value is any;
export declare function isUndefined(value: any): value is undefined;
export declare function isEmpty(value: any): boolean;
export declare function mapObject<R, V>(map: Record<string, V>, getValue: (value: V, key: string) => R, getKey?: (key: string, value: V) => string): Record<string, R>;
export declare function toArray<T>(iter: IterableIterator<T>): T[];
export declare function getCompare(less: number, more: number): number;
export declare const COMPARE_TYPE_ORDER: {
    'boolean': number;
    'number': number;
    'bigint': number;
    'string': number;
    'symbol': number;
    'object': number;
    'undefined': number;
    'function': number;
};
export declare function compare(a: any, b: any): number;
export declare function copy(x: any, originals?: any[], clones?: any[]): any;
