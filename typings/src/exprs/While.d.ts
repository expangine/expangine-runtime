import { Expression, ExpressionProvider } from '../Expression';
import { BooleanType } from '../types/Boolean';
export declare class WhileExpression extends Expression {
    static MAX_ITERATIONS: number;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): WhileExpression;
    static encode(expr: WhileExpression): any;
    condition: Expression;
    body: Expression;
    breakVariable: string;
    maxIterations: number;
    constructor(condition: Expression, body: Expression, breakVariable: string, maxIterations: number);
    getScope(): {
        [x: string]: BooleanType;
    };
    encode(): any;
}
