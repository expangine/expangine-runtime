import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class ForExpression extends Expression {
    static MAX_ITERATIONS: number;
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): ForExpression;
    static encode(expr: ForExpression): any;
    variable: string;
    start: Expression;
    end: Expression;
    body: Expression;
    breakVariable: string;
    maxIterations: number;
    constructor(variable: string, start: Expression, end: Expression, body: Expression, breakVariable?: string, maxIterations?: number);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): {
        [x: string]: BooleanType | NumberType;
    };
    encode(): any;
    getType(def: Definitions, original: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
    validate(def: Definitions, context: Type, handler: ValidationHandler): void;
    loop(variable: string, start: ExpressionValue, end: ExpressionValue, body?: Expression, breakVariable?: string, maxIterations?: number): ForExpression;
    startAt(start: ExpressionValue): ForExpression;
    endAt(end: ExpressionValue): ForExpression;
    run(expr: Expression): ForExpression;
    withVariable(name: string): ForExpression;
    withBreak(name: string): ForExpression;
    withMax(iterations: number): ForExpression;
}
