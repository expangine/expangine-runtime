import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
export declare class GetExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): GetExpression;
    static encode(expr: GetExpression): any;
    static create(path: ExpressionValue[]): GetExpression;
    path: Expression[];
    constructor(path: Expression[]);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    add(expr: ExpressionValue | ExpressionValue[]): GetExpression;
}
