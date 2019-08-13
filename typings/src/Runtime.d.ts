import { Command, CommandBuilder, OperationToCommand } from './Command';
import { Definitions } from './Definitions';
import { Expression, ExpressionClass } from './Expression';
import { OperationBuilder } from './Operation';
import { TypeMap, TypeInput } from './Type';
import { FunctionType } from './types/Function';
export declare class Runtime {
    defs: Definitions;
    ops: Record<string, OperationToCommand>;
    exprs: Record<string, CommandBuilder>;
    constructor(defs: Definitions);
    extend(defs?: Definitions): Runtime;
    setOperation<R extends TypeInput, P extends TypeMap = any, O extends TypeMap = any, S extends TypeMap = any>(builder: OperationBuilder<any, R, P, O, S>, op: OperationToCommand<R, P, O, S>): void;
    setExpression<T extends Expression>(type: ExpressionClass<T>, getter: CommandBuilder<T>): void;
    getFunction(name: string): FunctionType;
    getOperation(id: string): OperationToCommand;
    getOperationScopeDefaults(id: string): Record<string, string>;
    getExpression(id: string): CommandBuilder;
    getCommand(expr: Expression): Command;
    eval(value: any): Command;
}
