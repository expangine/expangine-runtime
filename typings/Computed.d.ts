import { Operation } from './Operation';
export interface Computed {
    id: string;
    op: string;
    value: string;
    params: Record<string, any>;
    writeable?: {
        op: string;
        value: string;
        newValue: string;
        params: Record<string, any>;
    };
}
export declare class Computeds {
    prefix: string;
    map: Record<string, Computed>;
    list: Computed[];
    constructor(prefix: string);
    set<P extends string = never, O extends string = never, V extends P = never>(localId: string, op: Operation<P, O, any, any, any>, value?: V, params?: Partial<Record<P | O, any>>): Computed;
    setWritable<P extends string = never, O extends string = never, V extends P = never, N extends P = never>(localId: string, op: Operation<P, O, any, any, any>, value: V, newValue: N, params?: Partial<Record<P | O, any>>): Computed;
    get(id: string): Computed;
}
