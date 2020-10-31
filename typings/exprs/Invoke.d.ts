import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { FunctionType } from '../types/Function';
export declare class InvokeExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): InvokeExpression;
    static encode(expr: InvokeExpression): any;
    name: string;
    args: ExpressionMap;
    constructor(name: string, args: ExpressionMap);
    getId(): string;
    getFunction(def: DefinitionProvider, context: Type, thisType?: Type): {
        type: FunctionType;
        expression?: Expression;
    } | null;
    getComplexity(def: DefinitionProvider, context: Type, thisType?: Type): number;
    getScope(): null;
    encode(): any;
    clone(): Expression;
    getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler, thisType?: Type): void;
    mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean;
    getInnerExpression(def: DefinitionProvider, context: any, parent?: any): Expression | string | false;
    named(name: string): InvokeExpression;
    arg(name: string, value: ExpressionValue): InvokeExpression;
    arg(args: Record<string, ExpressionValue>): InvokeExpression;
}
