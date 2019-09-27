import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
export declare class NoExpression extends Expression {
    static id: string;
    static readonly instance: NoExpression;
    static decode(data: any[], exprs: ExpressionProvider): NoExpression;
    static encode(expr: NoExpression): any;
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
}
