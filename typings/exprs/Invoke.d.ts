import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
export declare class InvokeExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): InvokeExpression;
    static encode(expr: InvokeExpression): any;
    name: string;
    args: Record<string, Expression>;
    constructor(name: string, args: Record<string, Expression>);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
}
