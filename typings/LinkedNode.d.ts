export declare class LinkedNode<T> {
    value: T;
    next: LinkedNode<T>;
    prev: LinkedNode<T>;
    constructor(value: T);
    isEmpty(): boolean;
    clear(): void;
    addLast(value: T): LinkedNode<T>;
    addFirst(value: T): LinkedNode<T>;
    each(callback: (value: T, index: number, node: LinkedNode<T>) => any): number;
    isRemoved(): boolean;
    remove(): void;
    linkAfter(node: LinkedNode<T>): void;
}
