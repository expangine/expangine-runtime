import { Expression, ExpressionProvider } from '../Expression';
import { BooleanType } from '../types/Boolean';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
export declare class DoExpression extends Expression {
    static MAX_ITERATIONS: number;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): DoExpression;
    static encode(expr: DoExpression): any;
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
    traverse<R>(traverse: Traverser<Expression, R>): R;
    do(body: Expression, condition?: Expression): DoExpression;
    while(condition: Expression): DoExpression;
    withBreak(name: string): DoExpression;
    withMax(iterations: number): DoExpression;
}
