import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class GetExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): GetExpression;
    static encode(expr: GetExpression): any;
    static create(path: ExpressionValue[]): GetExpression;
    path: Expression[];
    constructor(path: Expression[]);
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
    add(expr: ExpressionValue | ExpressionValue[]): GetExpression;
}
