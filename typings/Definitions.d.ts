import { Type, TypeClass, TypeParser, TypeInput, TypeInputMap, TypeMap } from './Type';
import { Expression, ExpressionClass, ExpressionMap } from './Expression';
import { Operations, Operation, OperationTypes, OperationTypeInput } from './Operation';
import { OptionalType } from './types/Optional';
import { ManyType } from './types/Many';
import { FunctionType } from './types/Function';
import { ObjectType } from './types/Object';
export interface DefinitionsImportOptions {
    aliases?: Record<string, Type | any>;
    functions?: Record<string, FunctionType | any>;
}
export interface DefinitionsOptions extends DefinitionsImportOptions {
    types?: TypeClass[];
    expressions?: ExpressionClass[];
}
export declare class Definitions {
    types: Record<string, TypeClass>;
    describers: TypeClass[];
    parsers: Record<string, TypeParser>;
    expressions: Record<string, ExpressionClass>;
    operations: Operations;
    aliased: TypeMap;
    functions: Record<string, FunctionType>;
    constructor(initial?: DefinitionsOptions);
    extend(deepCopy?: boolean, initial?: DefinitionsOptions): Definitions;
    add(options: DefinitionsOptions): void;
    describe(data: any): Type;
    mergeTypes(readonlyTypes: Type[]): Type | null;
    merge(type: Type, data: any): Type;
    mergeType(a: Type, b: Type): Type;
    optionalType(type: Type): OptionalType;
    requiredType(type: Type): Type;
    getTypes(type: Type): Type[];
    getReducedType(type: Type[]): Type;
    sortDescribers(): void;
    addType<T extends Type>(type: TypeClass<T>, delaySort?: boolean): void;
    addAlias<T extends Type>(alias: string, instance: T | any): void;
    getType(value: any): Type;
    addFunction(name: string, returnType: TypeInput, params: TypeInputMap, expr: any): FunctionType;
    setFunction(name: string, typeValue: any): FunctionType;
    getFunction(name: string): FunctionType;
    getOperation(id: string): Operation<any, any, any, any, any> | null;
    getOperationTypes(id: string): OperationTypes<any, any, any> | null;
    getOperationReturnType(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type): Type | null;
    getOperationParamTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type): TypeMap;
    getContextWithScope(original: Type, scope?: TypeMap): {
        context: ObjectType | ManyType;
        scope: Record<string, Type<any>>;
    };
    getOperationInputType(input: OperationTypeInput<any>, params: TypeMap): Type;
    getPathType(path: Expression[], context: Type, stopBefore?: number): Type | null;
    addExpression<T extends Expression>(expr: ExpressionClass<T>): void;
    getExpression(value: any): Expression;
    export(): DefinitionsImportOptions;
    import(exported: DefinitionsImportOptions): void;
}
