import { Expression, ExpressionProvider } from '../Expression';
export declare class OperationExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): OperationExpression;
    static encode(expr: OperationExpression): any;
    name: string;
    params: Record<string, Expression>;
    scopeAlias: Record<string, string>;
    constructor(name: string, params: Record<string, Expression>, scopeAlias: Record<string, string>);
    getScope(): null;
    encode(): any;
}
