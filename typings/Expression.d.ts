import { Type, TypeMap } from './Type';
import { Definitions } from './Definitions';
import { Traversable, Traverser, TraverseStep } from './Traverser';
import { ValidationHandler, Validation } from './Validate';
export interface ExpressionProvider {
    getExpression(value: any): Expression;
}
export interface ExpressionClass<T extends Expression = any> {
    id: string;
    decode(this: ExpressionClass<T>, data: any[], exprs: ExpressionProvider): T;
    encode(this: ExpressionClass<T>, expr: T): any;
    new (...args: any[]): T;
}
export declare type ExpressionValue = any | Expression;
export declare type ExpressionMap = Record<string, Expression>;
export declare abstract class Expression implements Traversable<Expression> {
    parent: Expression;
    abstract getId(): string;
    abstract getScope(): TypeMap | null;
    abstract getComplexity(def: Definitions): number;
    abstract encode(): any;
    abstract getType(def: Definitions, context: Type): Type | null;
    abstract traverse<R>(traverse: Traverser<Expression, R>): R;
    abstract setParent(parent?: Expression): void;
    abstract validate(def: Definitions, context: Type, handler: ValidationHandler): void;
    getPath(): TraverseStep[];
    getExpressionFromPath(path: TraverseStep[]): Expression | null;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null;
    getRootExpression(): Expression;
    validations(def: Definitions, context: Type): Validation[];
    protected validateType(def: Definitions, context: Type, expectedComplex: Type, subject: Expression | null, handler: ValidationHandler, parent?: Expression): void;
    protected validatePath(def: Definitions, context: Type, start: Type, subjects: Expression[], handler: ValidationHandler, parent?: Expression): void;
}
