import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
export declare class SetExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): SetExpression;
    static encode(expr: SetExpression): any;
    path: Expression[];
    value: Expression;
    constructor(path: Expression[], value: Expression);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
}
