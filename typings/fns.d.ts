export declare type RecordKey = string | number | symbol;
export declare type MapInput<K = any, V = any> = Map<K, V> | Array<[K, V]> | (K extends string | number | symbol ? Record<K, V> : never);
export declare function isNumber(value: any): value is number;
export declare function isString(value: any): value is string;
export declare function isArray<T = any>(value: any): value is T[];
export declare function isDate(value: any): value is Date;
export declare function isMap<K, V>(value: any): value is Map<K, V>;
export declare function isSet<V>(value: any): value is Set<V>;
export declare function isBoolean(value: any): value is boolean;
export declare function isFunction(value: any): value is ((...args: any[]) => any);
export declare function isObject(value: any): value is Record<string, any>;
export declare function isUndefined(value: any): value is undefined;
export declare function isSameClass(a: any, b: any): boolean;
export declare function isWhole(x: number, epsilon?: number): boolean;
export declare function isEmpty(value: any): value is ([] | {} | null | undefined);
export declare function now(): number;
export declare function clamp(x: number, min: number, max: number): number;
export declare function toMap<K = any, V = any>(input?: MapInput<K, V>): Map<K, V>;
export declare function reverseMap<K, V>(map: Map<K, V>): Map<V, K>;
export declare function arraySync<V, W = V>(target: V[], source: W[], matches: (target: V, source: W) => boolean, add: (target: V[], value: W) => void, remove: (target: V[], index: number, value: V) => void, update: (target: V[], index: number, value: V, newValue: W) => void): V[];
export declare function objectSync<V, K extends RecordKey = string>(target: Record<K, V>, source: Record<K, V>, add: (target: Record<K, V>, key: K, value: V) => void, remove: (target: Record<K, V>, key: K, value: V) => void, update: (target: Record<K, V>, key: K, value: V, withValue: V) => void): Record<K, V>;
export declare function objectMap<O extends Record<string, any>, M extends Record<keyof O, any>>(map: O, getValue: <K extends keyof O>(value: O[K], key: K) => M[K]): M;
export declare function objectEach<O extends Record<string, any>>(map: O, onEach: <K extends keyof O>(value: O[K], key: K, map: O) => any): void;
export declare function objectValues<O extends Record<string, any> = any, M = O[keyof O]>(map: O, transform?: <K extends keyof O>(value: O[K], key: K) => M): M[];
export declare function objectReduce<R, V, K extends RecordKey = string>(map: Record<K, V>, reduce: (value: V, key: K, reduced: R) => R, initial: R): R;
export declare function objectFromProps<P extends string, V>(props: P[], getValue: (prop: P, index: number) => V): Record<P, V>;
export declare function objectToArray<K extends RecordKey, V, T>(map: Record<K, V>, getItem: (value: V, key: K) => T): T[];
export declare function coalesce<T>(x: T | undefined, y: T): T;
export declare function coalesce<T>(x: T, y?: T | undefined): T;
export declare function coalesce<T>(x?: T, y?: T): T | undefined;
export declare function padNumber(x: number, length: number, first?: number): string;
export declare function pad(x: string, length: number, padding: string, before: boolean): string;
export declare function toString(x: any): string;
