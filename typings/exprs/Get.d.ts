import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class GetExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): GetExpression;
    static encode(expr: GetExpression): any;
    getId(): string;
    getComplexity(def: DefinitionProvider, context: Type): number;
    getScope(): undefined;
    encode(): any;
    clone(): Expression;
    getType(def: DefinitionProvider, context: Type): Type | undefined;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | undefined;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void;
    mutates(def: DefinitionProvider, arg: string): boolean;
    isPathStart(): boolean;
    isPathNode(): boolean;
}
