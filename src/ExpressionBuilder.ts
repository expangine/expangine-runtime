
import { Expression, ExpressionValue } from './Expression'
import { NotExpression } from './exprs/Not';
import { AndExpression } from './exprs/And';
import { ChainExpression } from './exprs/Chain';
import { NoExpression } from './exprs/No';
import { DefineExpression } from './exprs/Define';
import { DoExpression } from './exprs/Do';
import { ConstantExpression } from './exprs/Constant';
import { ForExpression } from './exprs/For';
import { GetExpression } from './exprs/Get';
import { IfExpression } from './exprs/If';
import { InvokeExpression } from './exprs/Invoke';
import { OperationExpression } from './exprs/Operation';
import { Operation } from './Operation';
import { OrExpression } from './exprs/Or';
import { ReturnExpression } from './exprs/Return';
import { SetExpression } from './exprs/Set';
import { SwitchExpression } from './exprs/Switch';
import { TemplateExpression } from './exprs/Template';
import { UpdateExpression } from './exprs/Update';
import { WhileExpression } from './exprs/While';
import { toExpr } from './fns';


export class ExpressionBuilder
{

  public and(...exprs: Expression[]): AndExpression
  {
    return new AndExpression(exprs);
  }

  public body(...exprs: Expression[]): ChainExpression
  {
    return new ChainExpression(exprs);
  }

  public const(value: any): ConstantExpression
  {
    return new ConstantExpression(value);
  }

  public define(vars: Record<string, ExpressionValue> = {}, body: Expression = NoExpression.instance): DefineExpression
  {
    return new DefineExpression(toExpr(vars), body);
  }

  public do(body: Expression, condition: Expression = NoExpression.instance, breakVariable?: string, maxIterations?: number): DoExpression
  {
    return new DoExpression(condition, body, breakVariable, maxIterations);
  }

  public for(variable: string, start: ExpressionValue = new ConstantExpression(0), end: ExpressionValue = new ConstantExpression(0), body: Expression = NoExpression.instance, breakVariable?: string, maxIterations?: number): ForExpression
  {
    return new ForExpression(variable, toExpr(start), toExpr(end), body, breakVariable, maxIterations);
  }

  public get(...path: ExpressionValue[]): GetExpression
  {
    return new GetExpression(toExpr(path));
  }

  public if(condition: Expression, body: Expression = NoExpression.instance, otherwise: Expression = NoExpression.instance): IfExpression
  {
    return new IfExpression([[condition, body]], otherwise);
  }

  public invoke(name: string, args: Record<string, ExpressionValue> = {}): InvokeExpression
  {
    return new InvokeExpression(name, toExpr(args));
  }

  public not(expr: Expression): NotExpression
  {
    return new NotExpression(expr);
  }

  public op<P extends string, O extends string, S extends string>(
    op: Operation<P, O, S>, 
    params: Record<P, ExpressionValue> & Partial<Record<O, ExpressionValue>>,
    scopeAlias: Partial<Record<S, string>> = Object.create(null)
  ): OperationExpression<P, O, S> {
    return new OperationExpression<P, O, S>(op.id, toExpr(params), scopeAlias);
  }

  public or(...exprs: Expression[]): OrExpression
  {
    return new OrExpression(exprs);
  }

  public return(value: ExpressionValue = NoExpression.instance): ReturnExpression
  {
    return new ReturnExpression(toExpr(value));
  }

  public set(...path: ExpressionValue[]): SetExpression
  {
    return new SetExpression(toExpr(path), NoExpression.instance);
  }

  public switch<P extends string, O extends string, S extends string>(value: Expression, op: Operation<P, O, S>): SwitchExpression
  {
    return new SwitchExpression(value, op.id, [], NoExpression.instance);
  }

  public template(template: string, params: Record<string, ExpressionValue> = {}): TemplateExpression
  {
    return new TemplateExpression(template, toExpr(params));
  }

  public update(...path: ExpressionValue[]): UpdateExpression
  {
    return new UpdateExpression(toExpr(path), NoExpression.instance);
  }

  public while(condition: Expression, body: Expression = NoExpression.instance, breakVariable?: string, maxIterations?: number): WhileExpression
  {
    return new WhileExpression(condition, body, breakVariable, maxIterations);
  }

}