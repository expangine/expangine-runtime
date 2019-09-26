export declare type TraverseStep = string | number;
export declare type TraverseCallback<T> = (value: T, stack: T[], path: TraverseStep[]) => any;
export interface Traversable<T> {
    traverse<R>(traverse: Traverser<T, R>): R;
}
export declare class Traverser<T, R = any> {
    static isTraversable<T>(x: any): x is Traversable<T>;
    callback: TraverseCallback<T>;
    stack: T[];
    path: TraverseStep[];
    result: R;
    stopped: boolean;
    constructor(callback: TraverseCallback<T>, initialResult?: R);
    enter(value: T, getInner?: () => any): R;
    step(step: TraverseStep, getStep: Traversable<T> | (() => any)): this;
    modify(getResult: (result: R) => R | undefined): this;
    stop(result?: R): this;
    getResult(): R;
    filterClass(construct: {
        new (...args: any[]): T;
    }, initialResult?: R): Traverser<T, R>;
    filter(pass: (value: T, stack: T[], path: TraverseStep[]) => any, initialResult?: R): Traverser<T, R>;
}
