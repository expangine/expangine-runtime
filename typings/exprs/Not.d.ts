import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { AndExpression } from './And';
import { OrExpression } from './Or';
export declare class NotExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): NotExpression;
    static encode(expr: NotExpression): any;
    expression: Expression;
    constructor(expression: Expression);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    and(exprs: Expression | Expression[]): AndExpression;
    or(exprs: Expression | Expression[]): OrExpression;
}
