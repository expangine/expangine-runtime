
import { isArray } from './fns';
import { TypeMap } from './Type';
import { Definitions } from './Definitions';
import { OperationBuilder } from './Operation';
import { Expression, ExpressionClass } from './Expression';
import { Command, CommandBuilder, OperationToCommand } from './Command';


export class Runtime 
{

  public defs: Definitions;
  public ops: Record<string, OperationToCommand>;
  public exprs: Record<string, CommandBuilder>;

  public constructor (defs: Definitions) 
  {
    this.defs = defs;
    this.ops = Object.create(null);
    this.exprs = Object.create(null);
  }

  public setOperation<P extends TypeMap = any, O extends TypeMap = any, S extends TypeMap = any>(
    builder: OperationBuilder<any, any, P, O, S>, 
    op: OperationToCommand<P, O, S>
  ): void 
  {
    this.ops[builder.id] = op;
  }

  public setExpression<T extends Expression>(type: ExpressionClass<T>, getter: CommandBuilder<T>) 
  {
    this.exprs[type.id] = getter;
  }

  public getOperation (id: string): OperationToCommand 
  {
    return this.ops[id];
  }

  public getExpression (id: string): CommandBuilder
  {
    return this.exprs[id];
  }

  public getCommand(expr: Expression): Command 
  {
    return this.exprs[expr.id](expr, this);
  }

  public eval (value: any): Command 
  {
    return isArray(value)
      ? this.getCommand(this.defs.getExpression(value))
      : () => value;
  }

}