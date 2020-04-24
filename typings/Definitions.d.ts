import { Type, TypeClass, TypeParser, TypeMap, TypeCompatibleOptions } from './Type';
import { Expression, ExpressionClass, ExpressionMap } from './Expression';
import { Operations, OperationTypes, OperationTypeInput, OperationGeneric, OperationPair, OperationMapping, OperationTypeProvider } from './Operation';
import { Computeds, Computed } from './Computed';
import { Relation, RelationOptions, EntityRelation } from './Relation';
import { Program, ProgramOptions, ProgramDataSet } from './Program';
import { Entity, EntityOptions, EntityProps, EntityTranscoder } from './Entity';
import { Func, FuncOptions, FuncTest } from './Func';
import { EntityType } from './types/Entity';
import { ManyType } from './types/Many';
import { ObjectType } from './types/Object';
import { GetEntityExpression } from './exprs/GetEntity';
import { InvokeExpression } from './exprs/Invoke';
import { GetRelationExpression } from './exprs/GetRelation';
import { Runtime } from './Runtime';
import { DefinitionProvider } from './DefinitionProvider';
import { ReferenceDataOptions, ReferenceData } from './ReferenceData';
import { GetDataExpression } from './exprs/GetData';
import { ReferenceType } from './types/Reference';
import { NamedMap } from './maps/NamedMap';
import { EventBase } from './EventBase';
export interface DefinitionsImportOptions {
    entities?: Record<string, Entity | EntityOptions>;
    functions?: Record<string, Func | FuncOptions>;
    relations?: Record<string, RelationOptions>;
    programs?: Record<string, Program | ProgramOptions>;
    data?: Record<string, ReferenceData | ReferenceDataOptions>;
}
export interface DefinitionsOptions extends DefinitionsImportOptions {
    types?: TypeClass[];
    expressions?: ExpressionClass[];
}
export declare type DefinitionsReferenceSource = Program | [Program, ProgramDataSet] | Entity | [Entity, 'key' | 'describe'] | [Entity, string, EntityTranscoder] | [Entity, string, EntityTranscoder, 'encode' | 'decode'] | [Entity, Func] | [Entity, Func, 'params' | 'returnType'] | [Entity, Func, FuncTest, 'args' | 'expected'] | Func | [Func, 'params' | 'returnType'] | [Func, FuncTest, 'args' | 'expected'] | Relation | ReferenceData;
export declare type DefinitionsEntityReference = ({
    value: EntityType;
    root: Type;
} | {
    value: GetEntityExpression;
    root: Expression;
}) & {
    source: DefinitionsReferenceSource;
};
export declare type DefinitionsDataReference = ({
    value: ReferenceType;
    root: Type;
} | {
    value: GetDataExpression;
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
export interface DefinitionsEvents {
    changed(defs: Definitions): void;
    sync(defs: Definitions, options: DefinitionsOptions): void;
    addRelation(defs: Definitions, relation: Relation): void;
    removeRelation(defs: Definitions, relation: Relation): void;
    updateRelation(defs: Definitions, relation: Relation): void;
    renameRelation(defs: Definitions, relation: Relation, oldName: string): void;
    clearRelations(defs: Definitions, relations: Relation[]): void;
    changedRelations(defs: Definitions): void;
    addProgram(defs: Definitions, program: Program): void;
    removeProgram(defs: Definitions, program: Program): void;
    updateProgram(defs: Definitions, program: Program): void;
    renameProgram(defs: Definitions, program: Program, oldName: string): void;
    clearPrograms(defs: Definitions, programs: Program[]): void;
    changedPrograms(defs: Definitions): void;
    addEntity(defs: Definitions, entity: Entity): void;
    removeEntity(defs: Definitions, entity: Entity): void;
    updateEntity(defs: Definitions, entity: Entity): void;
    renameEntity(defs: Definitions, entity: Entity, oldName: string): void;
    clearEntities(defs: Definitions, entities: Entity[]): void;
    changedEntities(defs: Definitions): void;
    addFunction(defs: Definitions, func: Func): void;
    removeFunction(defs: Definitions, func: Func): void;
    updateFunction(defs: Definitions, func: Func): void;
    renameFunction(defs: Definitions, func: Func, oldName: string): void;
    clearFunctions(defs: Definitions, functions: Func[]): void;
    changedFunctions(defs: Definitions): void;
    addData(defs: Definitions, data: ReferenceData): void;
    removeData(defs: Definitions, data: ReferenceData): void;
    updateData(defs: Definitions, data: ReferenceData): void;
    renameData(defs: Definitions, data: ReferenceData, oldName: string): void;
    clearData(defs: Definitions, data: ReferenceData[]): void;
    changedData(defs: Definitions): void;
}
export declare class Definitions extends EventBase<DefinitionsEvents> implements OperationTypeProvider, DefinitionProvider {
    types: Record<string, TypeClass>;
    typeList: TypeClass[];
    describers: TypeClass[];
    parsers: Record<string, TypeParser>;
    expressions: Record<string, ExpressionClass>;
    operations: Operations;
    computeds: Computeds;
    relations: NamedMap<Relation>;
    programs: NamedMap<Program>;
    entities: NamedMap<Entity>;
    functions: NamedMap<Func>;
    data: NamedMap<ReferenceData>;
    keyExpectedType: Type;
    describeExpectedType: Type;
    private legacy;
    constructor(initial?: DefinitionsOptions);
    isLegacy(): boolean;
    setLegacy(): void;
    private encodeMap;
    extend(deepCopy?: boolean, initial?: DefinitionsOptions): Definitions;
    changed(): void;
    add(options: DefinitionsOptions): void;
    describe(data: any): Type;
    merge(type: Type, data: any): Type;
    sortDescribers(): void;
    addType<T extends Type>(type: TypeClass<T>, delaySort?: boolean): void;
    findEntity(type: Type, options?: TypeCompatibleOptions): string | false;
    addData(dataOptions: ReferenceData | Partial<ReferenceDataOptions>, sync?: boolean, delayChange?: boolean): this;
    getData(name: string): ReferenceData | null;
    getDatas(): NamedMap<ReferenceData>;
    removeData(dataInput: string | ReferenceData, stopWithReferences?: boolean, respectOrder?: boolean, delayChange?: boolean): boolean;
    clearData(delayChange?: boolean): void;
    renameData(dataInput: string | ReferenceData, newName: string, delayChange?: boolean): false | DefinitionsDataReference[];
    addFunction(funcOptions: Func | Partial<FuncOptions>, sync?: boolean, delayChange?: boolean): this;
    getFunction(name: string): Func | null;
    getFunctions(): NamedMap<Func>;
    addProgram(programOptions: Program | Partial<ProgramOptions>, sync?: boolean, delayChange?: boolean): this;
    getProgram(name: string): Program | null;
    getPrograms(): NamedMap<Program>;
    removeProgram(programInput: string | Program, respectOrder?: boolean, delayChange?: boolean): boolean;
    clearPrograms(delayChange?: boolean): void;
    addEntity(entityOptions: Entity | Partial<EntityOptions>, sync?: boolean, delayChange?: boolean): this;
    getEntity(name: string): Entity | null;
    getEntities(): NamedMap<Entity>;
    addRelation(relationOptions: Relation | RelationOptions, sync?: boolean, delayChange?: boolean): this;
    getRelation(name: string): Relation | null;
    getRelations(entityName: string): EntityRelation[];
    getEntityProps(name: string): EntityProps[];
    removeRelation(relationInput: string | Relation, stopWithReferences?: boolean, respectOrder?: boolean, delayChange?: boolean): boolean;
    clearRelations(delayChange?: boolean): void;
    renameProgram(programInput: string | Program, newName: string, delayChange?: boolean): boolean;
    renameEntity(entityInput: string | Entity, newName: string, delayChange?: boolean): false | DefinitionsEntityReference[];
    renameEntityProp(name: string | Entity, prop: string, newProp: string): void;
    removeEntityProp(name: string | Entity, prop: string): void;
    removeEntity(entityInput: string | Entity, stopWithReferences?: boolean, respectOrder?: boolean, delayChange?: boolean): boolean;
    clearEntities(delayChange?: boolean): void;
    refactorEntity(entity: string | Entity, transform: Expression, runtime: Runtime): DefinitionsDataTypeReference<EntityType>[];
    renameRelation(relationInput: string | Relation, newName: string, delayChange?: boolean): false | DefinitionsRelationReference[];
    renameFunction(funcInput: string | Func, newName: string, delayChange?: boolean): false | DefinitionsFunctionReference[];
    renameFunctionParameter(funcInput: string | Func, oldName: string, newName: string): false | DefinitionsFunctionReference[];
    removeFunctionParameter(funcInput: string | Func, name: string): false | DefinitionsFunctionReference[];
    removeFunction(funcInput: string | Func, stopWithReferences?: boolean, respectOrder?: boolean, delayChange?: boolean): boolean;
    clearFunctions(delayChange?: boolean): void;
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
    getEntityReferences(entity?: string | Entity): DefinitionsEntityReference[];
    getDataReferences(data?: string | ReferenceData): DefinitionsDataReference[];
    getEntityDataReferences(entity?: string | Entity): DefinitionsDataTypeReference<EntityType>[];
    getRelationReferences(relation?: string | Relation): DefinitionsRelationReference[];
    getFunctionReferences(func?: string | Func, param?: string): DefinitionsFunctionReference[];
    getTypeClassReferences<T extends Type>(typeClass: TypeClass<T>): DefinitionsTypeReference<T>[];
    getDataTypeClassReferences<T extends Type>(typeClass: TypeClass<T>): DefinitionsDataTypeReference<T>[];
    getExpressionClassReferences<E extends Expression>(exprClass: ExpressionClass<E>): DefinitionsExpressionReference<E>[];
    getDataInstances(): DefinitionsDataInstance[];
    getTypeInstances(dynamic?: boolean): DefinitionsTypeInstance[];
    getExpressionInstances(): DefinitionsExpressionInstance[];
    export(): DefinitionsImportOptions;
    sync(exported: DefinitionsImportOptions): void;
    import(exported: DefinitionsImportOptions): void;
}
