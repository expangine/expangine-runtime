import { Type, TypeMap } from './Type';
import { DefinitionProvider } from './DefinitionProvider';
import { Traversable, Traverser, TraverseStep } from './Traverser';
import { ValidationHandler, Validation } from './Validate';
import { FlowType } from "./FlowType";
export interface ExpressionProvider {
    getExpression(value: any): Expression;
    getType(data: any, otherwise?: Type): Type;
    setLegacy(): void;
}
export interface ExpressionParser {
    (data: any[], exprs: ExpressionProvider): Expression;
}
export interface ExpressionClass<T extends Expression = any> {
    id: string;
    decode(this: ExpressionClass<T>, data: any[], exprs: ExpressionProvider): Expression;
    encode(this: ExpressionClass<T>, expr: T): any;
    new (...args: any[]): T;
}
export declare type ExpressionValue = any | Expression;
export declare type ExpressionMap = Record<string, Expression>;
export declare abstract class Expression implements Traversable<Expression> {
    static INSTANCE: string;
    parent?: Expression;
    abstract getId(): string;
    abstract getScope(): TypeMap | undefined;
    abstract getComplexity(def: DefinitionProvider, context: Type, thisType?: Type): number;
    abstract encode(): any;
    abstract clone(): Expression;
    abstract getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | undefined;
    abstract traverse<R>(traverse: Traverser<Expression, R>): R;
    abstract setParent(parent?: Expression): void;
    hasExpression(condition: ExpressionClass | ((e: Expression) => boolean)): boolean;
    abstract validate(def: DefinitionProvider, context: Type, handler: ValidationHandler, thisType?: Type): void;
    abstract mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean;
    isValidFlow(def: DefinitionProvider, type: FlowType, child?: Expression): boolean;
    getContextFor(steps: TraverseStep[], def: DefinitionProvider, context: Type, thisType?: Type): Type;
    isDynamic(): boolean;
    getInnerExpression(def: DefinitionProvider, context: any, parent?: any): Expression | string | false;
    isPathStart(): boolean;
    isPathNode(): boolean;
    isPathWritable(defs: DefinitionProvider): boolean;
    getPath(): TraverseStep[];
    getExpressionFromPath(path: TraverseStep[]): Expression | undefined;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | undefined;
    getRootExpression(): Expression;
    validations(def: DefinitionProvider, context: Type): Validation[];
    protected validateType(def: DefinitionProvider, context: Type, expectedComplex: Type | undefined, subject: Expression | undefined, handler: ValidationHandler, parent?: Expression): void;
}
