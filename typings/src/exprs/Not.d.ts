import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
export declare class NotExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): NotExpression;
    static encode(expr: NotExpression): any;
    expression: Expression;
    constructor(expression: Expression);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
}
