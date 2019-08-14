import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { AnyType } from '../types/Any';
export declare class UpdateExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): UpdateExpression;
    static encode(expr: UpdateExpression): any;
    path: Expression[];
    value: Expression;
    currentVariable: string;
    constructor(path: Expression[], value: Expression, currentVariable: string);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): {
        [x: string]: AnyType;
    };
    encode(): any;
}
