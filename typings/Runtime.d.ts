import { Command, CommandBuilder, OperationToCommand } from './Command';
import { Definitions } from './Definitions';
import { Expression, ExpressionClass } from './Expression';
import { Operation } from './Operation';
import { FunctionType } from './types/Function';
export declare class Runtime<Context = any, Result = any> {
    static DEFAULT_RETURN_PROPERTY: string;
    defs: Definitions;
    ops: Record<string, OperationToCommand<Context, Result, any, any, any>>;
    exprs: Record<string, CommandBuilder<Context, Result>>;
    returnProperty: string;
    constructor(defs: Definitions);
    extend(defs?: Definitions): Runtime<Context, Result>;
    setOperation<P extends string = any, O extends string = any, S extends string = any>(operation: Operation<P, O, S, any, any>, impl: OperationToCommand<Context, Result, P, O, S>): this;
    setExpression<T extends Expression>(type: ExpressionClass<T>, getter: CommandBuilder<Context, Result, T>): this;
    getFunction(name: string): FunctionType;
    getOperation(id: string): OperationToCommand<Context, Result, any, any, any>;
    getOperationScopeDefaults(id: string): Record<string, string>;
    getExpression(id: string): CommandBuilder<Context, Result>;
    getCommand(expr: Expression): Command<Context, Result>;
    eval(value: any): Command<Context, Result>;
}
