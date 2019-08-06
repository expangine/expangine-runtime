import { TypeMap } from './Type';
import { Definitions } from './Definitions';
import { OperationBuilder } from './Operation';
import { Expression, ExpressionClass } from './Expression';
import { Command, CommandBuilder, OperationToCommand } from './Command';
export declare class Runtime {
    defs: Definitions;
    ops: Record<string, OperationToCommand>;
    exprs: Record<string, CommandBuilder>;
    constructor(defs: Definitions);
    setOperation<P extends TypeMap = any, O extends TypeMap = any, S extends TypeMap = any>(builder: OperationBuilder<any, any, P, O, S>, op: OperationToCommand<P, O, S>): void;
    setExpression<T extends Expression>(type: ExpressionClass<T>, getter: CommandBuilder<T>): void;
    getOperation(id: string): OperationToCommand;
    getExpression(id: string): CommandBuilder;
    getCommand(expr: Expression): Command;
    eval(value: any): Command;
}
