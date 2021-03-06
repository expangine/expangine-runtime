import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class GetRelationExpression extends Expression {
    static id: string;
    static readonly instance: GetRelationExpression;
    static decode(data: any[], exprs: ExpressionProvider): GetRelationExpression;
    static encode(expr: GetRelationExpression): any;
    name: string;
    constructor(name: string);
    getId(): string;
    getComplexity(def: DefinitionProvider, context: Type): number;
    getScope(): undefined;
    encode(): any;
    clone(): Expression;
    getType(def: DefinitionProvider, context: Type): Type | undefined;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void;
    mutates(def: DefinitionProvider, arg: string): boolean;
}
