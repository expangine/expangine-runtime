import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
export declare class InvokeExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): InvokeExpression;
    static encode(expr: InvokeExpression): any;
    name: string;
    args: ExpressionMap;
    constructor(name: string, args: ExpressionMap);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    named(name: string): InvokeExpression;
    arg(name: string, value: ExpressionValue): InvokeExpression;
    arg(args: Record<string, ExpressionValue>): InvokeExpression;
}
