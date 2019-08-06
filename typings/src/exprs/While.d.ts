import { Expression, ExpressionProvider } from '../Expression';
export declare class WhileExpression extends Expression {
    static MAX_ITERATIONS: number;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): WhileExpression;
    static encode(expr: WhileExpression): any;
    condition: Expression;
    body: Expression;
    maxIterations: number;
    constructor(condition: Expression, body: Expression, maxIterations: number);
    encode(): any;
}
