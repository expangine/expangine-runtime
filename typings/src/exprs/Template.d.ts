import { Expression, ExpressionProvider } from '../Expression';
export declare class TemplateExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): TemplateExpression;
    static encode(expr: TemplateExpression): any;
    template: string;
    params: Record<string, Expression>;
    constructor(template: string, params: Record<string, Expression>);
    getScope(): null;
    encode(): any;
}
