import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
export declare class TemplateExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): TemplateExpression;
    static encode(expr: TemplateExpression): any;
    template: string;
    params: Record<string, Expression>;
    constructor(template: string, params: Record<string, Expression>);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    param(name: string, value: ExpressionValue): TemplateExpression;
    param(params: Record<string, ExpressionValue>): TemplateExpression;
}
