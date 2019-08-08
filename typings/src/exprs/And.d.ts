import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
export declare class AndExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): AndExpression;
    static encode(expr: AndExpression): any;
    expressions: Expression[];
    constructor(expressions: Expression[]);
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
}
