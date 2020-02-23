import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class DefineExpression extends Expression {
    static STEP_DEFINE: string;
    static STEP_BODY: string;
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
    clone(): Expression;
    getType(def: Definitions, original: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null;
    setParent(parent?: Expression): void;
    validate(def: Definitions, context: Type, handler: ValidationHandler): void;
    with(name: string, value: ExpressionValue): DefineExpression;
    with(defines: Record<string, ExpressionValue>): DefineExpression;
    run(expr: Expression): DefineExpression;
}
