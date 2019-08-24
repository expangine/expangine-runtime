import { Type, TypeClass, TypeParser, TypeInput, TypeMap } from './Type';
import { Expression, ExpressionClass } from './Expression';
import { Operations, OperationBuilder } from './Operation';
import { FunctionType } from './types/Function';
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
    operations: Operations<any>;
    aliased: Record<string, Type>;
    functions: Record<string, FunctionType>;
    constructor(initial?: DefinitionsOptions);
    extend(deepCopy?: boolean, initial?: DefinitionsOptions): Definitions;
    add(options: DefinitionsOptions): void;
    describe(data: any): Type;
    merge(type: Type, data: any): Type;
    mergeType(a: Type, b: Type): Type;
    optionalType(type: Type): Type;
    requiredType(type: Type): Type;
    getTypes(type: Type): Type[];
    getReducedType(type: Type[]): Type;
    sortDescribers(): void;
    addType<T extends Type>(type: TypeClass<T>, delaySort?: boolean): void;
    addAlias<T extends Type>(alias: string, instance: T | any): void;
    getType(value: any): Type;
    addFunction(name: string, returnType: TypeInput, params: TypeMap, expr: any): FunctionType;
    setFunction(name: string, typeValue: any): FunctionType;
    getFunction(name: string): FunctionType;
    getOperationBuilder(id: string): OperationBuilder<any> | null;
    addExpression<T extends Expression>(expr: ExpressionClass<T>): void;
    getExpression(value: any): Expression;
    export(): DefinitionsImportOptions;
    import(exported: DefinitionsImportOptions): void;
}
