import { Expression } from './Expression';
import { FunctionType } from './types/Function';
export interface Command {
    (context: object): any;
}
export declare type CommandParams<P extends string, O extends string> = CommandsFor<P> & Partial<CommandsFor<O>>;
export declare type CommandsFor<T extends string | never> = [T] extends [never] ? {} : Record<T, Command>;
export declare type OperationToCommand<P extends string = never, O extends string = never, S extends string = never> = (params: CommandParams<P, O>, scope: Record<S, string>) => Command;
export declare type CommandBuilder<T extends Expression = any> = (expr: T, commands: CommandProvider) => Command;
export interface CommandProvider {
    getCommand(expr: Expression): Command;
    getOperation(id: string): OperationToCommand;
    getOperationScopeDefaults(id: string): Record<string, string>;
    getFunction(name: string): FunctionType;
}
