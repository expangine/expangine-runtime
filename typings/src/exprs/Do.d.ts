import { Expression, ExpressionProvider } from '../Expression';
import { BooleanType } from '../types/Boolean';
export declare class DoExpression extends Expression {
    static MAX_ITERATIONS: number;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): DoExpression;
    static encode(expr: DoExpression): any;
    condition: Expression;
    body: Expression;
    breakCondition: string;
    maxIterations: number;
    constructor(condition: Expression, body: Expression, breakCondition: string, maxIterations: number);
    getScope(): {
        [x: string]: BooleanType;
    };
    encode(): any;
}
