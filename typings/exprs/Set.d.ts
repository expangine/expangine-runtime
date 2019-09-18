import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
export declare class SetExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): SetExpression;
    static encode(expr: SetExpression): any;
    static create(path: ExpressionValue[], value: ExpressionValue): SetExpression;
    path: Expression[];
    value: Expression;
    constructor(path: Expression[], value: Expression);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    add(expr: ExpressionValue | ExpressionValue[]): SetExpression;
    to(value: ExpressionValue): SetExpression;
}
