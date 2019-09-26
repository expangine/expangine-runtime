import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
export declare class ReturnExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): ReturnExpression;
    static encode(expr: ReturnExpression): any;
    value: Expression;
    constructor(value: Expression);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
}
