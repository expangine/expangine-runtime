import { Type, TypeInput } from './Type';
export interface OperationFlags {
    complexity: number;
    mutates: string[];
}
export interface Operation<P extends string = never, O extends string = never, S extends string = never> extends OperationFlags {
    id: string;
    params: P[];
    optional: O[];
    scope: S[];
    scopeDefaults?: Record<S, string>;
}
export declare type OperationTypeInput<I extends string> = TypeInput | ((inputs: Record<I, Type | undefined>) => TypeInput);
export interface OperationTypes<P extends string = never, O extends string = never, S extends string = never> {
    returnType: OperationTypeInput<P | O>;
    params: Record<P, OperationTypeInput<P | O>>;
    optional: Record<O, OperationTypeInput<P | O>>;
    scope: Record<S, OperationTypeInput<P | O>>;
}
export declare class Operations {
    prefix: string;
    map: Record<string, Operation<any, any, any>>;
    types: Record<string, OperationTypes<any, any, any>>;
    constructor(prefix: string);
    get(id: string): Operation<any, any, any>;
    getTypes(id: string): OperationTypes<any, any, any>;
    set<P extends string = never, O extends string = never, S extends string = never>(localId: string, flags?: Partial<OperationFlags>, params?: P[], optional?: O[], scope?: S[]): Operation<P, O, S>;
    setTypes(op: Operation<never, never, never>, returnType: OperationTypeInput<never>): OperationTypes<never, never, never>;
    setTypes<P extends string>(op: Operation<P, never, never>, returnType: OperationTypeInput<P>, params: Record<P, OperationTypeInput<P>>): OperationTypes<P, never, never>;
    setTypes<P extends string, O extends string>(op: Operation<P, O, never>, returnType: OperationTypeInput<P | O>, params: Record<P, OperationTypeInput<P | O>>, optional: Record<O, OperationTypeInput<P | O>>): OperationTypes<P, O, never>;
    setTypes<P extends string, O extends string, S extends string>(op: Operation<P, O, S>, returnType: OperationTypeInput<P | O>, params: Record<P, OperationTypeInput<P | O>>, optional: Record<O, OperationTypeInput<P | O>>, scope: Record<S, OperationTypeInput<P | O>>): OperationTypes<P, O, S>;
}
