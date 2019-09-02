import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { TypeMap } from '../Type';
import { OperationBuilder } from '../Operation';
export declare class OperationExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): OperationExpression;
    static encode(expr: OperationExpression): any;
    static create<P extends TypeMap, O extends TypeMap, S extends TypeMap>(op: OperationBuilder<any, any, P, O, S>, params: Record<keyof P, Expression> & Partial<Record<keyof O, Expression>>, scopeAlias?: Partial<Record<keyof S, string>>): OperationExpression;
    name: string;
    params: Record<string, Expression>;
    scopeAlias: Record<string, string>;
    constructor(name: string, params: Record<string, Expression>, scopeAlias?: Record<string, string>);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
}
