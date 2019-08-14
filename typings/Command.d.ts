import { TypeMap } from './Type';
import { Expression } from './Expression';
import { FunctionType } from './types/Function';
export interface Command {
    (context: object): any;
}
export declare type CommandParams<P extends TypeMap, O extends TypeMap> = CommandsFor<P> & Partial<CommandsFor<O>>;
export declare type CommandsFor<T extends TypeMap> = [T] extends [never] ? {} : Record<keyof T, Command>;
export declare type OperationToCommand<P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never> = (params: CommandParams<P, O>, scope: Record<keyof S, string>) => Command;
export declare type CommandBuilder<T extends Expression = any> = (expr: T, commands: CommandProvider) => Command;
export interface CommandProvider {
    getCommand(expr: Expression): Command;
    getOperation(id: string): OperationToCommand;
    getOperationScopeDefaults(id: string): Record<string, string>;
    getFunction(name: string): FunctionType;
}
