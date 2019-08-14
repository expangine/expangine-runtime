import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
export declare class OperationExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): OperationExpression;
    static encode(expr: OperationExpression): any;
    name: string;
    params: Record<string, Expression>;
    scopeAlias: Record<string, string>;
    constructor(name: string, params: Record<string, Expression>, scopeAlias: Record<string, string>);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
}
