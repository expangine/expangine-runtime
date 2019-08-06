import { Expression, ExpressionProvider } from '../Expression';
export declare class SetExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): SetExpression;
    static encode(expr: SetExpression): any;
    path: Expression[];
    value: Expression;
    constructor(path: Expression[], value: Expression);
    getScope(): null;
    encode(): any;
}
