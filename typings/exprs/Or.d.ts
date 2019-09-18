import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { AndExpression } from './And';
export declare class OrExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): OrExpression;
    static encode(expr: OrExpression): any;
    expressions: Expression[];
    constructor(expressions: Expression[]);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    or(exprs: Expression | Expression[]): OrExpression;
    and(exprs: Expression | Expression[]): AndExpression;
}
