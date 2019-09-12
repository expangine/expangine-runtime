import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { Operation } from '../Operation';
export declare class OperationExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): OperationExpression;
    static encode(expr: OperationExpression): any;
    static create<P extends string, O extends string, S extends string>(op: Operation<P, O, S>, params: Record<P, Expression> & Partial<Record<O, Expression>>, scopeAlias?: Partial<Record<S, string>>): OperationExpression;
    name: string;
    params: Record<string, Expression>;
    scopeAlias: Record<string, string>;
    constructor(name: string, params: Record<string, Expression>, scopeAlias?: Record<string, string>);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
}
