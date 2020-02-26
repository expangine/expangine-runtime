import { FastMap, FastMapOptions } from './FastMap';
export interface Named {
    name: string;
}
export declare type NamedMapOptions<N extends Named> = FastMapOptions<N> | N[];
export declare class NamedMap<N extends Named> extends FastMap<N> {
    static isNamedArray<N extends Named>(x: any): x is N[];
    constructor(options?: NamedMapOptions<N>);
    reset(options: NamedMapOptions<N>): void;
    merge(options: NamedMapOptions<N>): void;
    rename(namedInput: string | N, newName: string): boolean;
    has(named: string | N): boolean;
    add(named: N): void;
    nameOf(named: string | N): string;
    indexOf(named: string | N): number;
    keyOf(named: N): string | undefined;
    clone(): NamedMap<N>;
}
