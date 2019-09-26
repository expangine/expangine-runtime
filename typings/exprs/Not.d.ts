import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { AndExpression } from './And';
import { OrExpression } from './Or';
import { Type } from '../Type';
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
    getType(def: Definitions, context: Type): Type | null;
    and(exprs: Expression | Expression[]): AndExpression;
    or(exprs: Expression | Expression[]): OrExpression;
}
