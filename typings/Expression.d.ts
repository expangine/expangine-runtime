import { Type, TypeMap } from './Type';
import { DefinitionProvider } from './DefinitionProvider';
import { Traversable, Traverser, TraverseStep } from './Traverser';
import { ValidationHandler, Validation } from './Validate';
export interface ExpressionProvider {
    getExpression(value: any): Expression;
    setLegacy(): void;
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
    parent: Expression;
    abstract getId(): string;
    abstract getScope(): TypeMap | null;
    abstract getComplexity(def: DefinitionProvider, context: Type): number;
    abstract encode(): any;
    abstract clone(): Expression;
    abstract getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | null;
    abstract traverse<R>(traverse: Traverser<Expression, R>): R;
    abstract setParent(parent?: Expression): void;
    abstract validate(def: DefinitionProvider, context: Type, handler: ValidationHandler, thisType?: Type): void;
    abstract mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean;
    isDynamic(): boolean;
    getInnerExpression(def: DefinitionProvider): Expression | string | false;
    isPathStart(): boolean;
    isPathNode(): boolean;
    isPathWritable(defs: DefinitionProvider): boolean;
    getPath(): TraverseStep[];
    getExpressionFromPath(path: TraverseStep[]): Expression | null;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null;
    getRootExpression(): Expression;
    validations(def: DefinitionProvider, context: Type): Validation[];
    protected validateType(def: DefinitionProvider, context: Type, expectedComplex: Type, subject: Expression | null, handler: ValidationHandler, parent?: Expression): void;
}
