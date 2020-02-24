import { Type, TypeClass, TypeParser, TypeMap, TypeCompatibleOptions } from './Type';
import { Expression, ExpressionClass, ExpressionMap } from './Expression';
import { Operations, OperationTypes, OperationTypeInput, OperationGeneric, OperationPair, OperationMapping, OperationTypeProvider } from './Operation';
import { Computeds, Computed } from './Computed';
import { Relation, RelationOptions, EntityRelation } from './Relation';
import { Program, ProgramOptions, ProgramDataSet } from './Program';
import { Entity, EntityOptions, EntityProps, EntityStorageTranscoder } from './Entity';
import { Func, FuncOptions, FuncTest } from './Func';
import { EntityType } from './types/Entity';
import { ManyType } from './types/Many';
import { ObjectType } from './types/Object';
import { GetTypeExpression } from './exprs/GetType';
import { InvokeExpression } from './exprs/Invoke';
import { GetRelationExpression } from './exprs/GetRelation';
import { Runtime } from './Runtime';
import { DefinitionProvider } from './DefinitionProvider';
export interface DefinitionsImportOptions {
    entities?: Record<string, Entity | EntityOptions>;
    functions?: Record<string, Func | FuncOptions>;
    relations?: Record<string, RelationOptions>;
    programs?: Record<string, Program | ProgramOptions>;
}
export interface DefinitionsOptions extends DefinitionsImportOptions {
    types?: TypeClass[];
    expressions?: ExpressionClass[];
}
export declare type DefinitionsReferenceSource = Program | [Program, ProgramDataSet] | Entity | [Entity, 'key' | 'describe'] | [Entity, string, EntityStorageTranscoder] | [Entity, string, EntityStorageTranscoder, 'encode' | 'decode'] | [Entity, Func] | [Entity, Func, 'params' | 'returnType'] | [Entity, Func, FuncTest, 'args' | 'expected'] | Func | [Func, 'params' | 'returnType'] | [Func, FuncTest, 'args' | 'expected'] | Relation;
export declare type DefinitionsEntityReference = ({
    value: EntityType;
    root: Type;
} | {
    value: GetTypeExpression;
    root: Expression;
}) & {
    source: DefinitionsReferenceSource;
};
export interface DefinitionsRelationReference {
    value: GetRelationExpression;
    root: Expression;
    source: DefinitionsReferenceSource;
}
export interface DefinitionsFunctionReference {
    value: InvokeExpression;
    root: Expression;
    source: DefinitionsReferenceSource;
}
export interface DefinitionsExpressionReference<E extends Expression> {
    value: E;
    root: Expression;
    source: DefinitionsReferenceSource;
}
export interface DefinitionsTypeReference<T extends Type> {
    value: T;
    root: Type;
    source: DefinitionsReferenceSource;
}
export interface DefinitionsDataTypeReference<T extends Type> {
    type: T;
    data: any;
    root: Type;
    source: DefinitionsReferenceSource;
}
export interface DefinitionsDataInstance {
    data: any;
    type: Type;
    source: DefinitionsReferenceSource;
}
export interface DefinitionsTypeInstance {
    type: Type;
    source: DefinitionsReferenceSource;
}
export interface DefinitionsExpressionInstance {
    expr: Expression;
    context: Type;
    source: DefinitionsReferenceSource;
}
export declare class Definitions implements OperationTypeProvider, DefinitionProvider {
    types: Record<string, TypeClass>;
    typeList: TypeClass[];
    describers: TypeClass[];
    parsers: Record<string, TypeParser>;
    expressions: Record<string, ExpressionClass>;
    operations: Operations;
    computeds: Computeds;
    relations: Record<string, Relation>;
    programs: Record<string, Program>;
    entities: Record<string, Entity>;
    functions: Record<string, Func>;
    constructor(initial?: DefinitionsOptions);
    extend(deepCopy?: boolean, initial?: DefinitionsOptions): Definitions;
    add(options: DefinitionsOptions): void;
    describe(data: any): Type;
    merge(type: Type, data: any): Type;
    sortDescribers(): void;
    addType<T extends Type>(type: TypeClass<T>, delaySort?: boolean): void;
    findEntity(type: Type, options?: TypeCompatibleOptions): string | false;
    addFunction(func: Func | Partial<FuncOptions>): this;
    getFunction(name: string): Func | null;
    addProgram(program: Program | Partial<ProgramOptions>): this;
    getProgram(name: string): Program;
    addEntity(entity: Entity | Partial<EntityOptions>): this;
    getEntity(name: string): Entity | null;
    getEntities(): Record<string, Entity>;
    addRelation(relation: Relation | RelationOptions): this;
    getRelation(name: string): Relation;
    getRelations(entityName: string): EntityRelation[];
    getEntityProps(name: string): EntityProps[];
    renameProgram(name: string, newName: string): boolean;
    renameEntity(name: string, newName: string): false | DefinitionsEntityReference[];
    renameEntityProp(name: string, prop: string, newProp: string): void;
    removeEntityProp(name: string, prop: string): void;
    removeEntity(name: string, stopWithReferences?: boolean): boolean;
    refactorEntity(name: string, transform: Expression, runtime: Runtime): DefinitionsDataTypeReference<EntityType>[];
    renameRelation(oldName: string, newName: string): false | DefinitionsRelationReference[];
    renameFunction(oldName: string, newName: string): false | DefinitionsFunctionReference[];
    renameFunctionParameter(functionName: string, oldName: string, newName: string): false | DefinitionsFunctionReference[];
    removeFunctionParameter(functionName: string, name: string): false | DefinitionsFunctionReference[];
    removeFunction(name: string, stopWithReferences?: boolean): boolean;
    getTypeKind<T extends Type>(value: any, kind: TypeClass<T>, otherwise?: T | null): T | null;
    getType(value: any, otherwise?: Type): Type;
    getBaseTypes(): Type[];
    getSimpleTypes(): Type[];
    getComplexTypes(): Type[];
    getSimpleTypeClasses(): TypeClass[];
    getComplexTypeClasses(): TypeClass[];
    getComputed(id: string): Computed | null;
    getComputedReturnType(id: string, valueType?: Type | null): Type | null;
    getComputedsFor(valueType: Type): Computed[];
    hasComputed(valueType: Type, id: string): boolean;
    getOperation(id: string): OperationGeneric | null;
    getOperationTypes(id: string): OperationTypes<any, any, any> | null;
    getOperationReturnType(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type): Type | null;
    getOperationExpectedTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type, rawTypes?: boolean): TypeMap;
    getOperationParamTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type, rawTypes?: boolean): TypeMap;
    getOperationScopeContext(id: string, types: TypeMap, scopeAlias: Record<string, string>, context: Type): Type;
    getContextWithScope(original: Type, scope?: TypeMap): {
        context: ObjectType<{
            props: any;
        }> | ManyType;
        scope: Record<string, Type<any>>;
    };
    getContext(original: Type, scope: TypeMap): Type;
    getOperationMapping(fromId: string, fromParamTypes: TypeMap, toId: string): OperationMapping | null;
    getOperationInputType(input: OperationTypeInput<any>): Type | null;
    getOperationInputType(input: OperationTypeInput<any>, params: TypeMap): Type;
    getOperationsForExpression(expr: Expression, context: Type): OperationPair[];
    getOperationsWithMapping(fromId: string, fromParamTypes: TypeMap): OperationMapping[];
    getOperationsForType(type: Type, acceptsDynamic?: boolean): OperationPair[];
    getOperationsWithReturnExpression(expr: Expression, context: Type, paramTypes?: TypeMap, acceptsDynamic?: boolean): OperationPair[];
    getOperationsWithReturnType(type: Type, paramTypes?: TypeMap, acceptsDynamic?: boolean): OperationPair[];
    getOperationsForParamExpressions(params: ExpressionMap, context: Type): OperationPair[];
    getOperationsForParamTypes(paramTypes: TypeMap): OperationPair[];
    getOperations(onOperation?: <P extends string, O extends string, S extends string>(pair: OperationPair<P, O, S>) => boolean): OperationPair[];
    getPathType(path: Expression[], context: Type, stopBefore?: number): Type | null;
    addExpression<T extends Expression>(expr: ExpressionClass<T>): void;
    getExpression(value: any): Expression;
    getEntityReferences(name?: string): DefinitionsEntityReference[];
    getEntityDataReferences(name?: string): DefinitionsDataTypeReference<EntityType>[];
    getRelationReferences(relation?: string): DefinitionsRelationReference[];
    getFunctionReferences(name?: string, param?: string): DefinitionsFunctionReference[];
    getTypeClassReferences<T extends Type>(typeClass: TypeClass<T>): DefinitionsTypeReference<T>[];
    getDataTypeClassReferences<T extends Type>(typeClass: TypeClass<T>): DefinitionsDataTypeReference<T>[];
    getExpressionClassReferences<E extends Expression>(exprClass: ExpressionClass<E>): DefinitionsExpressionReference<E>[];
    getDataInstances(): DefinitionsDataInstance[];
    getTypeInstances(dynamic?: boolean): DefinitionsTypeInstance[];
    getExpressionInstances(): DefinitionsExpressionInstance[];
    export(): DefinitionsImportOptions;
    import(exported: DefinitionsImportOptions): void;
}
