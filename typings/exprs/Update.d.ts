import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
import { AnyType } from '../types/Any';
import { Type } from '../Type';
export declare class UpdateExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): UpdateExpression;
    static encode(expr: UpdateExpression): any;
    static create(path: ExpressionValue[], value: ExpressionValue, currentVariable?: string): UpdateExpression;
    path: Expression[];
    value: Expression;
    currentVariable: string;
    constructor(path: Expression[], value: Expression, currentVariable?: string);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): {
        [x: string]: AnyType;
    };
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    add(expr: ExpressionValue | ExpressionValue[]): UpdateExpression;
    to(value: ExpressionValue, currentVariable?: string): UpdateExpression;
    withVariable(name: string): UpdateExpression;
}
