import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { PathExpression } from './Path';
export declare class ComputedExpression extends Expression {
    static STEP_EXPRESSION: string;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): PathExpression | ComputedExpression;
    static encode(expr: ComputedExpression): any;
    name: string;
    constructor(name: string);
    getId(): string;
    getComplexity(def: DefinitionProvider, context: Type): number;
    getScope(): undefined;
    encode(): any;
    clone(): Expression;
    getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | undefined;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | undefined;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler, thisType?: Type): void;
    mutates(def: DefinitionProvider, arg: string): boolean;
    isPathNode(): boolean;
    isPathWritable(defs: DefinitionProvider): boolean;
}
