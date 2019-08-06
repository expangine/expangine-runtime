import { Type, TypeInput, TypeMap } from './Type';
export declare type OperationOptions<R extends TypeInput, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never> = [R] | [R, P] | [R, P, O] | [R, P, O, S];
export interface Operation<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never> {
    id: string;
    returnType: R;
    params?: P;
    optional?: O;
    scope?: S;
}
export interface OperationBuilder<T extends Type, R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never> {
    id: string;
    (type: T): Operation<R, P, O, S>;
}
export declare class Operations<T extends Type> {
    prefix: string;
    map: Record<string, OperationBuilder<T>>;
    constructor(prefix: string);
    get(id: string, type: T): Operation<any, any, any, any>;
    set<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never>(localId: string, returnType: R, params?: P, optional?: O, scope?: S): OperationBuilder<T, R, P, O, S>;
    build<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never>(localId: string, getOptions: (type: T) => OperationOptions<R, P, O, S>): OperationBuilder<T, R, P, O, S>;
    private put;
}
