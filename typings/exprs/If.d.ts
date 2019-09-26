import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
export declare class IfExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): IfExpression;
    static encode(expr: IfExpression): any;
    cases: [Expression, Expression][];
    otherwise: Expression;
    constructor(cases: [Expression, Expression][], otherwise: Expression);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    if(condition: Expression, body?: Expression): IfExpression;
    then(body: Expression): IfExpression;
    elseif(condition: Expression, body?: Expression): IfExpression;
    else(body: Expression): IfExpression;
}
