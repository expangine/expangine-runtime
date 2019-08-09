import { Type, TypeClass, TypeParser } from './Type';
import { Expression, ExpressionClass } from './Expression';
import { Operations, OperationBuilder } from './Operation';
interface DefinitionsOptions {
    types?: TypeClass[];
    expressions?: ExpressionClass[];
    aliases?: Record<string, Type | any>;
}
export declare class Definitions {
    types: Record<string, TypeClass>;
    describers: TypeClass[];
    parsers: Record<string, TypeParser>;
    expressions: Record<string, ExpressionClass>;
    operations: Operations<any>;
    constructor(initial?: DefinitionsOptions);
    describe(data: any): Type;
    merge(type: Type, data: any): Type;
    mergeType(a: Type, b: Type): Type;
    optionalType(type: Type): Type;
    requiredType(type: Type): Type;
    getTypes(type: Type): Type[];
    getReducedType(type: Type[]): Type;
    sortDescribers(): void;
    addType<T extends Type>(type: TypeClass<T>): void;
    addAlias<T extends Type>(alias: string, instance: T | any): void;
    getType(value: any): Type;
    getOperationBuilder(id: string): OperationBuilder<any> | null;
    addExpression<T extends Expression>(expr: ExpressionClass<T>): void;
    getExpression(value: any): Expression;
}
export {};
