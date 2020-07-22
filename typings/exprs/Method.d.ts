import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class MethodExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): MethodExpression;
    static encode(expr: MethodExpression): any;
    entity: string;
    name: string;
    args: ExpressionMap;
    constructor(entity: string, name: string, args: ExpressionMap);
    getId(): string;
    getComplexity(def: DefinitionProvider, context: Type): number;
    getScope(): null;
    encode(): any;
    clone(): Expression;
    getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler, thisType?: Type): void;
    getInnerExpression(def: DefinitionProvider): Expression | string | false;
    isPathNode(): boolean;
    named(name: string): MethodExpression;
    arg(name: string, value: ExpressionValue): MethodExpression;
    arg(args: Record<string, ExpressionValue>): MethodExpression;
}
