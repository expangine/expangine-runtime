export declare type TraverseStep = string | number;
export declare type TraverseCallback<T, R> = (value: T, stack: T[], path: TraverseStep[], traverser: Traverser<T, R>) => any;
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
    constructor(callback: TraverseCallback<T, R>, initialResult?: R);
    enter(value: T, getInner?: () => any): R;
    step(step: TraverseStep, getStep: Traversable<T> | (() => any)): this;
    modify(getResult: (result: R) => R | undefined): this;
    stop(result?: R): this;
    getResult(): R;
    filterClass(construct: {
        new (...args: any[]): T;
    }, initialResult?: R): Traverser<T, R>;
    filter(pass: (value: T, stack: T[], path: TraverseStep[]) => any, initialResult?: R): Traverser<T, R>;
    static list<T>(): Traverser<T, TraverseResult<T>[]>;
    static count<T>(): Traverser<T, number>;
}
