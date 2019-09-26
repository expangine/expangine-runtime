
import { Command, CommandBuilder, OperationToCommand } from './Command';
import { Definitions } from './Definitions';
import { Expression, ExpressionClass } from './Expression';
import { isArray } from './fns';
import { Operation } from './Operation';
import { FunctionType } from './types/Function';


export class Runtime<Context = any, Result = any>
{

  public static DEFAULT_RETURN_PROPERTY = '$$return';

  public defs: Definitions;
  public ops: Record<string, OperationToCommand<Context, Result, any, any, any>>;
  public exprs: Record<string, CommandBuilder<Context, Result>>;
  public returnProperty: string;

  public constructor (defs: Definitions) 
  {
    this.defs = defs;
    this.ops = Object.create(null);
    this.exprs = Object.create(null);
    this.returnProperty = Runtime.DEFAULT_RETURN_PROPERTY;
  }

  public extend(defs?: Definitions): Runtime<Context, Result>
  {
    const copy = new Runtime(defs || this.defs);

    Object.assign(copy.ops, this.ops);
    Object.assign(copy.exprs, this.exprs);
    copy.returnProperty = this.returnProperty;

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

  public getFunction (name: string): FunctionType
  {
    return this.defs.getFunction(name);
  }

  public getOperation (id: string): OperationToCommand<Context, Result, any, any, any> 
  {
    return this.ops[id];
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

  public getCommand(expr: Expression): Command<Context, Result>
  {
    return this.exprs[expr.getId()](expr, this);
  }

  public eval (value: any): Command<Context, Result> 
  {
    return isArray(value)
      ? this.getCommand(this.defs.getExpression(value))
      : () => value;
  }

}