import { Expression, ExpressionProvider } from '../Expression';
export declare class ConstantExpression extends Expression {
    static id: string;
    static decode(data: any[], expr: ExpressionProvider): ConstantExpression;
    static encode(expr: ConstantExpression): any;
    value: any;
    constructor(value: any);
    encode(): any;
}
