import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
export declare class TemplateExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): TemplateExpression;
    static encode(expr: TemplateExpression): any;
    template: string;
    params: ExpressionMap;
    constructor(template: string, params: ExpressionMap);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    param(name: string, value: ExpressionValue): TemplateExpression;
    param(params: Record<string, ExpressionValue>): TemplateExpression;
}
