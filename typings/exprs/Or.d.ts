import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { AndExpression } from './And';
import { Type } from '../Type';
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
    getType(def: Definitions, context: Type): Type | null;
    or(exprs: Expression | Expression[]): OrExpression;
    and(exprs: Expression | Expression[]): AndExpression;
}
