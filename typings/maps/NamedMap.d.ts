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
    sync(options: NamedMapOptions<N>, combine?: (original: N, given: N) => void): void;
    syncManual<O extends Named = N>(sourceOptions: NamedMapOptions<O>, add: (target: this, value: O, key: string) => void, remove: (target: this, value: N, key: string) => void, update: (target: this, value: N, newValue: O, key: string) => void, matches?: (a: N, b: O) => boolean): this;
    rename(namedInput: string | N, newName: string): boolean;
    has(named: string | N): boolean;
    add(named: N): void;
    nameOf(named: string | N): string;
    valueOf(named: N): N;
    valueOf(named: string | N): N | undefined;
    indexOf(named: string | N): number;
    keyOf(named: N): string | undefined;
    clone(): NamedMap<N>;
}
