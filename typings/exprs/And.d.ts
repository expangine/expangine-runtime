import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { OrExpression } from './Or';
import { Type } from '../Type';
export declare class AndExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): AndExpression;
    static encode(expr: AndExpression): any;
    expressions: Expression[];
    constructor(expressions: Expression[]);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    and(exprs: Expression | Expression[]): AndExpression;
    or(exprs: Expression | Expression[]): OrExpression;
}
