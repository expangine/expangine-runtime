import { Expression, ExpressionProvider } from '../Expression';
import { BooleanType } from '../types/Boolean';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
export declare class WhileExpression extends Expression {
    static MAX_ITERATIONS: number;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): WhileExpression;
    static encode(expr: WhileExpression): any;
    condition: Expression;
    body: Expression;
    breakVariable: string;
    maxIterations: number;
    constructor(condition: Expression, body: Expression, breakVariable?: string, maxIterations?: number);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): {
        [x: string]: BooleanType;
    };
    encode(): any;
    getType(def: Definitions, original: Type): Type | null;
    while(condition: Expression): WhileExpression;
    run(body: Expression): WhileExpression;
    withBreak(name: string): WhileExpression;
    withMax(iterations: number): WhileExpression;
}
