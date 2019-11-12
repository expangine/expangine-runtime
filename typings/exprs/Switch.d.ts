import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
import { Operation } from '../Operation';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
export declare class SwitchExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): SwitchExpression;
    static encode(expr: SwitchExpression): any;
    value: Expression;
    op: string;
    cases: [Expression[], Expression][];
    defaultCase: Expression;
    constructor(value: Expression, op: string, cases: [Expression[], Expression][], defaultCase: Expression);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
    private copyCases;
    val(value: ExpressionValue, op?: Operation): SwitchExpression;
    case(test: ExpressionValue): SwitchExpression;
    than(body: ExpressionValue): SwitchExpression;
    default(body: ExpressionValue): SwitchExpression;
}
