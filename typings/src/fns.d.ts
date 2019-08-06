export declare function isNumber(value: any): value is number;
export declare function isString(value: any): value is string;
export declare function isArray<T = any>(value: any): value is T[];
export declare function isBoolean(value: any): value is boolean;
export declare function isFunction(value: any): value is ((...args: any[]) => any);
export declare function isObject(value: any): value is any;
export declare function isUndefined(value: any): value is undefined;
export declare function isEmpty(value: any): boolean;
export declare function mapObject<R, V>(map: Record<string, V>, getValue: (value: V, key: string) => R, getKey?: (key: string, value: V) => string): Record<string, R>;
