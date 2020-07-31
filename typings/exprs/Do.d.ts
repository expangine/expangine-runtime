import { Expression, ExpressionProvider } from '../Expression';
import { BooleanType } from '../types/Boolean';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class DoExpression extends Expression {
    static STEP_CONDITION: string;
    static STEP_BODY: string;
    static MAX_ITERATIONS: number;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): DoExpression;
    static encode(expr: DoExpression): any;
    condition: Expression;
    body: Expression;
    breakVariable: string;
    maxIterations: number;
    constructor(condition: Expression, body: Expression, breakVariable?: string, maxIterations?: number);
    getId(): string;
    getComplexity(def: DefinitionProvider, context: Type): number;
    getScope(): {
        [x: string]: BooleanType;
    };
    encode(): any;
    clone(): Expression;
    getType(def: DefinitionProvider, original: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void;
    mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean;
    do(body: Expression, condition?: Expression): DoExpression;
    while(condition: Expression): DoExpression;
    withBreak(name: string): this;
    withMax(iterations: number): this;
}
