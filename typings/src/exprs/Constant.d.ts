import { Expression, ExpressionProvider } from '../Expression';
export declare class ConstantExpression extends Expression {
    static has(e: Expression, constant: any): boolean;
    static is(e: Expression): e is ConstantExpression;
    static id: string;
    static decode(data: any[], expr: ExpressionProvider): ConstantExpression;
    static encode(expr: ConstantExpression): any;
    value: any;
    constructor(value: any);
    getComplexity(): number;
    getScope(): null;
    encode(): any;
}
