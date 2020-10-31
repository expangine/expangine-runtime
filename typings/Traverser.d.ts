export declare type TraverseStep = string | number;
export declare type TraverseCallback<T, R> = (value: T, stack: T[], path: TraverseStep[], traverser: Traverser<T, R>) => any;
export declare type TraverseRemove = () => void;
export declare const TraverseRemoveNoop: TraverseRemove;
export declare type TraverseReplace<T> = (replaceWith: T) => void;
export declare const TraverseReplaceNoop: TraverseReplace<any>;
export interface Traversable<T> {
    traverse<R>(traverse: Traverser<T, R>): R;
}
export interface TraverseResult<T> {
    value: T;
    stack: T[];
    path: TraverseStep[];
}
export declare class Traverser<T, R = any> {
    static isTraversable<T>(x: any): x is Traversable<T>;
    callback: TraverseCallback<T, R>;
    stack: T[];
    path: TraverseStep[];
    result: R;
    stopped: boolean;
    remove: TraverseRemove;
    replace: TraverseReplace<T>;
    constructor(callback: TraverseCallback<T, R>, initialResult?: R);
    enter(value: T, getInner?: () => any): R;
    step(step: TraverseStep, getStep: Traversable<T> | (() => any), replace?: TraverseReplace<T>, remove?: TraverseRemove): this;
    modify(getResult: (result: R) => R | undefined): this;
    stop(result?: R): this;
    getResult(): R;
    removeOrReplace(replaceWith: T | (() => T)): boolean;
    canRemove(): boolean;
    canReplace(): boolean;
    filterClass(construct: {
        new (...args: any[]): T;
    }, initialResult?: R): Traverser<T, R>;
    filter(pass: (value: T, stack: T[], path: TraverseStep[]) => any, initialResult?: R): Traverser<T, R>;
    static list<T>(): Traverser<T, TraverseResult<T>[]>;
    static count<T>(): Traverser<T, number>;
    static some<T>(condition: (value: T) => boolean): Traverser<T, boolean>;
    static someInstance<T>(construct: {
        new (): T;
    }): Traverser<T, boolean>;
    static find<T>(condition: (value: T) => boolean): Traverser<T, T | null>;
}
