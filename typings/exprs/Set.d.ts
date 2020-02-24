import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class SetExpression extends Expression {
    static STEP_PATH: string;
    static STEP_VALUE: string;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): SetExpression;
    static encode(expr: SetExpression): any;
    static create(path: ExpressionValue[], value: ExpressionValue): SetExpression;
    path: Expression[];
    value: Expression;
    constructor(path: Expression[], value: Expression);
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
    add(expr: ExpressionValue | ExpressionValue[]): SetExpression;
    to(value: ExpressionValue): SetExpression;
}
