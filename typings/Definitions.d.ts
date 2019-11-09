import { Type, TypeClass, TypeParser, TypeInput, TypeInputMap, TypeMap } from './Type';
import { Expression, ExpressionClass, ExpressionMap } from './Expression';
import { Operations, OperationTypes, OperationTypeInput, OperationGeneric, OperationPair, OperationMapping } from './Operation';
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
    typeList: TypeClass[];
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
    maybeType<M extends Type>(type: Type, maybe: TypeClass<M>): Type<any>;
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
    cloneType(type: Type): Type<any>;
    getType(value: any): Type;
    getBaseTypes(): Type[];
    getSimpleTypes(): Type[];
    getComplexTypes(): Type[];
    getSimpleTypeClasses(): TypeClass[];
    getComplexTypeClasses(): TypeClass[];
    addFunction(name: string, returnType: TypeInput, params: TypeInputMap, expr: any): FunctionType;
    setFunction(name: string, typeValue: any): FunctionType;
    getFunction(name: string): FunctionType;
    getOperation(id: string): OperationGeneric | null;
    getOperationTypes(id: string): OperationTypes<any, any, any> | null;
    getOperationReturnType(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type): Type | null;
    getOperationExpectedTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type): TypeMap;
    getOperationParamTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type): TypeMap;
    getContextWithScope(original: Type, scope?: TypeMap): {
        context: ManyType | ObjectType<{
            props: any;
        }>;
        scope: Record<string, Type<any>>;
    };
    getContext(original: Type, scope: TypeMap): ManyType | ObjectType<{
        props: any;
    }>;
    getOperationMapping(fromId: string, fromParamTypes: TypeMap, toId: string): OperationMapping | null;
    getOperationInputType(input: OperationTypeInput<any>): Type | null;
    getOperationInputType(input: OperationTypeInput<any>, params: TypeMap): Type;
    getOperationsForExpression(expr: Expression, context: Type): OperationPair[];
    getOperationsWithMapping(fromId: string, fromParamTypes: TypeMap): OperationMapping[];
    getOperationsForType(type: Type): OperationPair[];
    getOperationsWithReturnExpression(expr: Expression, context: Type, paramTypes?: TypeMap, acceptsDynamic?: boolean): OperationPair[];
    getOperationsWithReturnType(type: Type, paramTypes?: TypeMap, acceptsDynamic?: boolean): OperationPair[];
    getOperationsForParamExpressions(params: ExpressionMap, context: Type): OperationPair[];
    getOperationsForParamTypes(paramTypes: TypeMap): OperationPair[];
    getOperations(onOperation?: <P extends string, O extends string, S extends string>(pair: OperationPair<P, O, S>) => boolean): OperationPair[];
    getPathType(path: Expression[], context: Type, stopBefore?: number): Type | null;
    addExpression<T extends Expression>(expr: ExpressionClass<T>): void;
    cloneExpression(expr: Expression): Expression;
    getExpression(value: any): Expression;
    export(): DefinitionsImportOptions;
    import(exported: DefinitionsImportOptions): void;
}
