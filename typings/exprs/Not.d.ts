import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { AndExpression } from './And';
import { OrExpression } from './Or';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class NotExpression extends Expression {
    static STEP_NOT: string;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): NotExpression;
    static encode(expr: NotExpression): any;
    expression: Expression;
    constructor(expression: Expression);
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
    and(exprs: Expression | Expression[]): AndExpression;
    or(exprs: Expression | Expression[]): OrExpression;
}
