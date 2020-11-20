import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { SetExpression } from './Set';
export declare class PathExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): PathExpression;
    static encode(expr: PathExpression): any;
    static createForLegacy(path: Expression[]): PathExpression;
    static fromPartial(pathData: any[], exprs: ExpressionProvider): PathExpression;
    expressions: Expression[];
    constructor(expressions: Expression[]);
    getId(): string;
    getComplexity(def: DefinitionProvider, context: Type): number;
    getScope(): undefined;
    encode(): any;
    clone(): PathExpression;
    getType(def: DefinitionProvider, context: Type): Type | undefined;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | undefined;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void;
    mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean;
    isWritable(defs: DefinitionProvider): boolean;
    isMutating(arg: string, directly?: boolean): boolean;
    set(value: Expression, currentVariable?: string): SetExpression;
}
