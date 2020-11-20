
import { Expression } from './Expression';
import { Computed } from './Computed';
import { Func } from './Func';


export interface Command<Context, Result> 
{
  (context: Context, parent?: any): Result;
}


export type CommandParams<
  Context, 
  Result,
  P extends string,
  O extends string
> = CommandsFor<Context, Result, P> & Partial<CommandsFor<Context, Result, O>>;


export type CommandsFor<Context, Result, T extends string | never> = [T] extends [never] 
  ? {} 
  : Record<T, Command<Context, Result>>;


export type OperationToCommand<
  Context, 
  Result,
  P extends string = never,
  O extends string = never,
  S extends string = never
> = (params: CommandParams<Context, Result, P, O>, scope: Record<S, string>) => Command<Context, Result>;


export type CommandBuilder<
  Context, 
  Result,
  T extends Expression = any
> = (expr: T, commands: CommandProvider<Context, Result>) => Command<Context, Result>;


export interface CommandProvider<Context, Result>
{
  flowProperty: string;
  getCommand(expr: Expression): Command<Context, Result>;
  getOperation(id: string): OperationToCommand<Context, Result, any, any, any>;
  getOperationScopeDefaults(id: string): Record<string, string>;
  getFunction(name: string): Func | undefined;
  getComputed(id: string): Computed | undefined;
}