import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class CommentExpression extends Expression {
    static id: string;
    static readonly instance: CommentExpression;
    static decode(data: any[], exprs: ExpressionProvider): CommentExpression;
    static encode(expr: CommentExpression): any;
    comment: string;
    constructor(comment: string);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
    validate(def: Definitions, context: Type, handler: ValidationHandler): void;
}
