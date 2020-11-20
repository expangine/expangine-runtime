import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
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
    getComplexity(def: DefinitionProvider): number;
    isDynamic(): boolean;
    getScope(): undefined;
    encode(): any;
    clone(): Expression;
    getType(def: DefinitionProvider, context: Type): Type | undefined;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void;
    isPathWritable(defs: DefinitionProvider): boolean;
    mutates(def: DefinitionProvider, arg: string): boolean;
}
