import { Command, CommandBuilder, OperationToCommand } from './Command';
import { Definitions } from './Definitions';
import { Expression, ExpressionClass } from './Expression';
import { Operation } from './Operation';
import { FunctionType } from './types/Function';
export declare class Runtime {
    static DEFAULT_RETURN_PROPERTY: string;
    defs: Definitions;
    ops: Record<string, OperationToCommand<any, any, any>>;
    exprs: Record<string, CommandBuilder>;
    returnProperty: string;
    constructor(defs: Definitions);
    extend(defs?: Definitions): Runtime;
    setOperation<P extends string = any, O extends string = any, S extends string = any>(operation: Operation<P, O, S>, impl: OperationToCommand<P, O, S>): this;
    setExpression<T extends Expression>(type: ExpressionClass<T>, getter: CommandBuilder<T>): this;
    getFunction(name: string): FunctionType;
    getOperation(id: string): OperationToCommand;
    getOperationScopeDefaults(id: string): Record<string, string>;
    getExpression(id: string): CommandBuilder;
    getCommand(expr: Expression): Command;
    eval(value: any): Command;
}
