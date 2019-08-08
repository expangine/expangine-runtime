
import { TypeMap } from './Type';
import { Expression } from './Expression';


export interface Command 
{
  (context: object): any;
}


export type CommandParams<
  P extends TypeMap,
  O extends TypeMap
> = CommandsFor<P> & Partial<CommandsFor<O>>;


export type CommandsFor<T extends TypeMap> = [T] extends [never] 
  ? {} 
  : Record<keyof T, Command>;


export type OperationToCommand<
  P extends TypeMap = never,
  O extends TypeMap = never,
  S extends TypeMap = never
> = (params: CommandParams<P, O>, scope: Record<keyof S, string>) => Command;


export type CommandBuilder<
  T extends Expression = any
> = (expr: T, commands: CommandProvider) => Command;


export interface CommandProvider 
{
  getCommand(expr: Expression): Command;
  getOperation(id: string): OperationToCommand;
  getOperationScopeDefaults(id: string): Record<string, string>;
}