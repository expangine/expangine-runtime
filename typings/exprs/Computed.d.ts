import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class ComputedExpression extends Expression {
    static STEP_EXPRESSION: string;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): ComputedExpression;
    static encode(expr: ComputedExpression): any;
    expression: Expression;
    name: string;
    constructor(expression: Expression, name: string);
    getId(): string;
    getComplexity(def: DefinitionProvider): number;
    getScope(): null;
    encode(): any;
    clone(): Expression;
    getType(def: DefinitionProvider, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void;
}
