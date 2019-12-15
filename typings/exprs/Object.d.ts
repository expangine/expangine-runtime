import { Expression, ExpressionProvider, ExpressionMap } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler } from '../Validate';
export declare class ObjectExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): ObjectExpression;
    static encode(expr: ObjectExpression): any;
    props: ExpressionMap;
    constructor(props: ExpressionMap);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
    getType(def: Definitions, context: Type): Type | null;
    traverse<R>(traverse: Traverser<Expression, R>): R;
    setParent(parent?: Expression): void;
    validate(def: Definitions, context: Type, handler: ValidationHandler): void;
}
