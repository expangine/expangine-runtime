import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { FlowType } from '../FlowType';
export declare class FlowExpression extends Expression {
    static STEP_VALUE: string;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): FlowExpression;
    static encode(expr: FlowExpression): any;
    type: FlowType;
    value: Expression;
    constructor(type: FlowType, value: Expression);
    getId(): string;
    getComplexity(def: DefinitionProvider, context: Type): number;
    isDynamic(): boolean;
    getScope(): null;
    encode(): any;
    clone(): Expression;
    getType(def: DefinitionProvider, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void;
    mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean;
    isPathWritable(defs: DefinitionProvider): boolean;
}
