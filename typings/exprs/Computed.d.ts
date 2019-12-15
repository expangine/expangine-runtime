import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class ComputedExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): ComputedExpression;
    static encode(expr: ComputedExpression): any;
    expression: Expression;
    name: string;
    constructor(expression: Expression, name: string);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
    validate(def: Definitions, context: Type, handler: ValidationHandler): void;
}
