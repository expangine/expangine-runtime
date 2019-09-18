import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
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
    named(name: string): InvokeExpression;
    arg(name: string, value: ExpressionValue): InvokeExpression;
    arg(args: Record<string, ExpressionValue>): InvokeExpression;
}
