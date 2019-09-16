
import { Expression } from './Expression';
import { FunctionType } from './types/Function';


export interface Command 
{
  (context: object): any;
}


export type CommandParams<
  P extends string,
  O extends string
> = CommandsFor<P> & Partial<CommandsFor<O>>;


export type CommandsFor<T extends string | never> = [T] extends [never] 
  ? {} 
  : Record<T, Command>;


export type OperationToCommand<
  P extends string = never,
  O extends string = never,
  S extends string = never
> = (params: CommandParams<P, O>, scope: Record<S, string>) => Command;


export type CommandBuilder<
  T extends Expression = any
> = (expr: T, commands: CommandProvider) => Command;


export interface CommandProvider 
{
  returnProperty: string;
  getCommand(expr: Expression): Command;
  getOperation(id: string): OperationToCommand;
  getOperationScopeDefaults(id: string): Record<string, string>;
  getFunction(name: string): FunctionType;
}