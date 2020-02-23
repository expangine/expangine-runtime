import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class SubExpression extends Expression {
    static STEP_PATH: string;
    static STEP_VALUE: string;
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
    clone(): Expression;
    getType(def: Definitions, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null;
    setParent(parent?: Expression): void;
    validate(def: Definitions, context: Type, handler: ValidationHandler): void;
    with(expr: ExpressionValue): SubExpression;
    sub(expr: ExpressionValue | ExpressionValue[]): SubExpression;
}
