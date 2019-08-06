import { Type, TypeClass, TypeParser } from './Type';
import { Expression, ExpressionClass } from './Expression';
import { Operations } from './Operation';
interface DefinitionsOptions {
    types?: TypeClass[];
    expressions?: ExpressionClass[];
    aliases?: Record<string, Type | any>;
}
export declare class Definitions {
    types: Record<string, TypeClass>;
    parsers: Record<string, TypeParser>;
    expressions: Record<string, ExpressionClass>;
    operations: Operations<any>;
    constructor(initial?: DefinitionsOptions);
    addType<T extends Type>(type: TypeClass<T>): void;
    addAlias<T extends Type>(alias: string, instance: T | any): void;
    getType(value: any): Type;
    addExpression<T extends Expression>(expr: ExpressionClass<T>): void;
    getExpression(value: any): Expression;
}
export {};
