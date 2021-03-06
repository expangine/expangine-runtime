import { Expression, ExpressionProvider } from '../Expression';
import { Type } from '../Type';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class ConstantExpression extends Expression {
    static ZERO: ConstantExpression;
    static ONE: ConstantExpression;
    static has(e: Expression, constant: any): boolean;
    static is(e: Expression): e is ConstantExpression;
    static id: string;
    static decode(data: any[], expr: ExpressionProvider): ConstantExpression;
    static encode(expr: ConstantExpression): any;
    value: any;
    constructor(value: any);
    getId(): string;
    getComplexity(): number;
    isDynamic(): boolean;
    getScope(): undefined;
    encode(): any;
    clone(): Expression;
    getType(def: DefinitionProvider, context: Type): Type | undefined;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
    validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void;
    mutates(def: DefinitionProvider, arg: string): boolean;
}
