import { Expression, ExpressionProvider } from '../Expression';
import { Type } from '../Type';
import { Definitions } from '../Definitions';
import { Traverser } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class ConstantExpression extends Expression {
    static has(e: Expression, constant: any): boolean;
    static is(e: Expression): e is ConstantExpression;
    static id: string;
    static decode(data: any[], expr: ExpressionProvider): ConstantExpression;
    static encode(expr: ConstantExpression): any;
    value: any;
    constructor(value: any);
    getId(): string;
    getComplexity(): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
    validate(def: Definitions, context: Type, handler: ValidationHandler): void;
}
