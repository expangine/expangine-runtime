
import { Command, CommandBuilder, OperationToCommand } from './Command';
import { Definitions } from './Definitions';
import { Expression, ExpressionClass } from './Expression';
import { isArray } from './fns';
import { OperationBuilder } from './Operation';
import { TypeMap, TypeInput } from './Type';


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

  public setOperation<R extends TypeInput, P extends TypeMap = any, O extends TypeMap = any, S extends TypeMap = any>(
    builder: OperationBuilder<any, R, P, O, S>, 
    op: OperationToCommand<R, P, O, S>
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
  
  public getOperationScopeDefaults (id: string): Record<string, string>
  {
    const builder = this.defs.getOperationBuilder(id);

    return builder ? builder.scopeDefaults : {};
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