import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { PathExpression } from './Path';
export declare class SetExpression extends Expression {
    static STEP_PATH: string;
    static STEP_VALUE: string;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): SetExpression;
    static encode(expr: SetExpression): any;
    static create(path: ExpressionValue[], value: ExpressionValue): SetExpression;
    path: PathExpression;
    value: Expression;
    constructor(path: PathExpression, value: Expression);
    getId(): string;
    getComplexity(def: DefinitionProvider, context: Type): number;
    getScope(): null;
    encode(): any;
    clone(): Expression;
    getType(def: DefinitionProvider, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void;
    to(value: ExpressionValue): SetExpression;
    mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean;
}
