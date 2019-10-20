import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
export declare class SubExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): SubExpression;
    static encode(expr: SubExpression): any;
    static create(value: ExpressionValue, path: ExpressionValue[]): SubExpression;
    value: Expression;
    path: Expression[];
    constructor(value: Expression, path: Expression[]);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
    with(expr: ExpressionValue): SubExpression;
    sub(expr: ExpressionValue | ExpressionValue[]): SubExpression;
}
