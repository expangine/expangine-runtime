import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
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
}
