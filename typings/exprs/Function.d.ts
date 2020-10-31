import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type, TypeMap } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { FunctionType } from '../types/Function';
export declare class FunctionExpression extends Expression {
    static STEP_BODY: string;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): FunctionExpression;
    static encode(expr: FunctionExpression): any;
    type: FunctionType;
    body: Expression;
    aliases?: Record<string, string>;
    constructor(type: FunctionType, body: Expression, aliases?: Record<string, string>);
    getId(): string;
    getComplexity(def: DefinitionProvider, context: Type): number;
    getScope(): null;
    encode(): any;
    clone(): Expression;
    getArgumentsAliased(): TypeMap;
    getBodyContext(def: DefinitionProvider, context: Type): Type;
    getCaptured(context: Type): TypeMap;
    getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void;
    mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean;
    getInnerExpression(def: DefinitionProvider): Expression | string | false;
}
