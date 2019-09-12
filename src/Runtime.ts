
import { Command, CommandBuilder, OperationToCommand } from './Command';
import { Definitions } from './Definitions';
import { Expression, ExpressionClass } from './Expression';
import { isArray } from './fns';
import { Operation } from './Operation';
import { FunctionType } from './types/Function';


export class Runtime 
{

  public defs: Definitions;
  public ops: Record<string, OperationToCommand<any, any, any>>;
  public exprs: Record<string, CommandBuilder>;

  public constructor (defs: Definitions) 
  {
    this.defs = defs;
    this.ops = Object.create(null);
    this.exprs = Object.create(null);
  }

  public extend(defs?: Definitions): Runtime
  {
    const copy = new Runtime(defs || this.defs);

    Object.assign(copy.ops, this.ops);
    Object.assign(copy.exprs, this.exprs);

    return copy;
  }

  public setOperation<P extends string = any, O extends string = any, S extends string = any>(
    operation: Operation<P, O, S>, 
    impl: OperationToCommand<P, O, S>
  ): this 
  {
    this.ops[operation.id] = impl;

    return this;
  }

  public setExpression<T extends Expression>(type: ExpressionClass<T>, getter: CommandBuilder<T>): this
  {
    this.exprs[type.id] = getter;

    return this;
  }

  public getFunction (name: string): FunctionType
  {
    return this.defs.getFunction(name);
  }

  public getOperation (id: string): OperationToCommand 
  {
    return this.ops[id];
  }
  
  public getOperationScopeDefaults (id: string): Record<string, string>
  {
    const op = this.defs.getOperation(id);

    return op ? op.scopeDefaults : {};
  }

  public getExpression (id: string): CommandBuilder
  {
    return this.exprs[id];
  }

  public getCommand(expr: Expression): Command 
  {
    return this.exprs[expr.getId()](expr, this);
  }

  public eval (value: any): Command 
  {
    return isArray(value)
      ? this.getCommand(this.defs.getExpression(value))
      : () => value;
  }

}