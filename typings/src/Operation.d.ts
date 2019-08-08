import { Type, TypeInput, TypeMap } from './Type';
import { GenericType } from './types/Generic';
export declare type OperationOptions<R extends TypeInput, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never> = [R] | [R, P] | [R, P, O] | [R, P, O, S];
export interface Operation<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never, G extends string = never> {
    id: string;
    returnType: R;
    params?: P;
    optional?: O;
    scope?: S;
    generics?: Record<G, GenericType>;
}
export interface OperationBuilder<T extends Type, R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never, G extends string = never> {
    id: string;
    scopeDefaults?: Record<keyof S, string>;
    (type: T): Operation<R, P, O, S, G>;
}
export declare class Operations<T extends Type> {
    prefix: string;
    map: Record<string, OperationBuilder<T>>;
    constructor(prefix: string);
    getBuilder(id: string): OperationBuilder<any>;
    get(id: string, type: T): Operation<any, any, any, any, any>;
    set<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never>(localId: string, returnType: R, params?: P, optional?: O, scope?: S): OperationBuilder<T, R, P, O, S>;
    build<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never, G extends string = never>(localId: string, getOptions: (type: T, generics?: Record<G, GenericType>) => OperationOptions<R, P, O, S>, scopeDefaults?: Record<keyof S, string>, generics?: Record<G, GenericType>): OperationBuilder<T, R, P, O, S>;
    private put;
}
