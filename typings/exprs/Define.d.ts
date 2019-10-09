import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
export declare class DefineExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): DefineExpression;
    static encode(expr: DefineExpression): any;
    define: [string, Expression][];
    body: Expression;
    constructor(define: [string, Expression][], body: Expression);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): {};
    encode(): any;
    getType(def: Definitions, original: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
    with(name: string, value: ExpressionValue): DefineExpression;
    with(defines: Record<string, ExpressionValue>): DefineExpression;
    run(expr: Expression): DefineExpression;
}
