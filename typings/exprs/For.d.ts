import { Expression, ExpressionProvider } from '../Expression';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { Definitions } from '../Definitions';
export declare class ForExpression extends Expression {
    static MAX_ITERATIONS: number;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): ForExpression;
    static encode(expr: ForExpression): any;
    variable: string;
    start: Expression;
    end: Expression;
    body: Expression;
    breakVariable: string;
    maxIterations: number;
    constructor(variable: string, start: Expression, end: Expression, body: Expression, breakVariable?: string, maxIterations?: number);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): {
        [x: string]: NumberType | BooleanType;
    };
    encode(): any;
}
