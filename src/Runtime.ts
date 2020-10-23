
import { Command, CommandBuilder, OperationToCommand, CommandProvider } from './Command';
import { Definitions } from './Definitions';
import { Expression, ExpressionClass } from './Expression';
import { isArray } from './fns';
import { Operation } from './Operation';
import { Computed } from './Computed';
import { Func } from './Func';



export class Runtime<Context = any, Result = any>
{

  public static DEFAULT_RETURN_PROPERTY = '$$flow';

  public defs: Definitions;
  public ops: Record<string, OperationToCommand<Context, Result, any, any, any>>;
  public exprs: Record<string, CommandBuilder<Context, Result>>;
  public flowProperty: string;

  public constructor (defs: Definitions) 
  {
    this.defs = defs;
    this.ops = Object.create(null);
    this.exprs = Object.create(null);
    this.flowProperty = Runtime.DEFAULT_RETURN_PROPERTY;
  }

  public extend(defs?: Definitions): Runtime<Context, Result>
  {
    const copy = new Runtime(defs || this.defs);

    Object.assign(copy.ops, this.ops);
    Object.assign(copy.exprs, this.exprs);
    copy.flowProperty = this.flowProperty;

    return copy;
  }

  public setOperation<P extends string = any, O extends string = any, S extends string = any>(
    operation: Operation<P, O, S, any, any>, 
    impl: OperationToCommand<Context, Result, P, O, S>
  ): this 
  {
    this.ops[operation.id] = impl;

    return this;
  }

  public setExpression<T extends Expression>(type: ExpressionClass<T>, getter: CommandBuilder<Context, Result, T>): this
  {
    this.exprs[type.id] = getter;

    return this;
  }

  public getFunction (name: string): Func
  {
    return this.defs.getFunction(name);
  }

  public getOperation (id: string): OperationToCommand<Context, Result, any, any, any> 
  {
    return this.ops[id];
  }

  public getComputed (id: string): Computed | null 
  {
    return this.defs.getComputed(id);
  }
  
  public getOperationScopeDefaults (id: string): Record<string, string>
  {
    const op = this.defs.getOperation(id);

    return op ? op.scopeDefaults : {};
  }

  public getExpression (id: string): CommandBuilder<Context, Result>
  {
    return this.exprs[id];
  }

  public getCommand(expr: Expression, provider: CommandProvider<Context, Result> = this): Command<Context, Result>
  {
    return this.exprs[expr.getId()](expr, provider);
  }

  public run(expr: any, context: Context, provider: CommandProvider<Context, Result> = this): Result
  {
    return this.eval(expr, provider)(context);
  }

  public eval (value: any, provider: CommandProvider<Context, Result> = this): Command<Context, Result> 
  {
    return isArray(value)
      ? this.getCommand(this.defs.getExpression(value), provider)
      : value instanceof Expression
        ? this.getCommand(value, provider)
        : () => value;
  }

}