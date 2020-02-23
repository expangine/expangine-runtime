
import { Expression, ExpressionValue, ExpressionMap } from './Expression'
import { NotExpression } from './exprs/Not';
import { AndExpression } from './exprs/And';
import { NoExpression } from './exprs/No';
import { DefineExpression } from './exprs/Define';
import { DoExpression } from './exprs/Do';
import { ChainExpression } from './exprs/Chain';
import { CommentExpression } from './exprs/Comment';
import { ComputedExpression } from './exprs/Computed';
import { ConstantExpression } from './exprs/Constant';
import { ForExpression } from './exprs/For';
import { GetExpression } from './exprs/Get';
import { GetTypeExpression } from './exprs/GetType';
import { GetRelationExpression } from './exprs/GetRelation';
import { IfExpression } from './exprs/If';
import { InvokeExpression } from './exprs/Invoke';
import { OperationExpression } from './exprs/Operation';
import { Operation } from './Operation';
import { OrExpression } from './exprs/Or';
import { ReturnExpression } from './exprs/Return';
import { SetExpression } from './exprs/Set';
import { SubExpression } from './exprs/Sub';
import { SwitchExpression } from './exprs/Switch';
import { TemplateExpression } from './exprs/Template';
import { UpdateExpression } from './exprs/Update';
import { WhileExpression } from './exprs/While';
import { TupleExpression } from './exprs/Tuple';
import { ObjectExpression } from './exprs/Object';
import { isArray, isObject, objectMap } from './fns';
import { Type } from './Type';


export class ExpressionBuilder
{

  public autoSetParent: boolean = true;

  public setParent<E extends Expression>(expr: E, force: boolean = false): E
  {
    if (this.autoSetParent || force)
    {
      expr.setParent();
    }

    return expr;
  }

  public parse(values: ExpressionValue[]): Expression[]
  public parse(values: Record<string, ExpressionValue>): ExpressionMap
  public parse(value: ExpressionValue): Expression
  public parse(value: ExpressionValue | ExpressionValue[] | Record<string, ExpressionValue>): Expression | Expression[] | ExpressionMap
  {
    return isArray(value)
      ? value.map((v) => this.parse(v))
      : value instanceof Expression 
        ? value
        : isObject(value)
          ? objectMap<Expression, ExpressionValue>(value, (v) => this.parse(v))
          : new ConstantExpression(value);
  }

  public cast(valueType: Type, targetType: Type): Expression;
  public cast(valueType: Type, targetType: Type, createOnMissing: false): Expression | null;
  public cast(valueType: Type, targetType: Type, createOnMissing: boolean = true): Expression
  {
    const opId = `${valueType.getId()}:~${targetType.getId()}`;
    const op = valueType.getOperations()[opId];

    return op
      ? this.op(op, { value: this.get('value') })
      : createOnMissing
        ? this.setParent(targetType.getCreateExpression())
        : null as unknown as Expression;
  }

  public and(...exprs: Expression[]): AndExpression
  {
    return this.setParent(new AndExpression(exprs));
  }

  public body(...exprs: Expression[]): ChainExpression
  {
    return this.setParent(new ChainExpression(exprs));
  }

  public const(value: any): ConstantExpression
  {
    return new ConstantExpression(value);
  }

  public define(vars: Record<string, ExpressionValue> = {}, body: Expression = NoExpression.instance): DefineExpression
  {
    return this.setParent(new DefineExpression([], body).with(vars));
  }

  public do(body: Expression, condition: Expression = NoExpression.instance, breakVariable?: string, maxIterations?: number): DoExpression
  {
    return this.setParent(new DoExpression(condition, body, breakVariable, maxIterations));
  }

  public for(variable: string, start: ExpressionValue = new ConstantExpression(0), end: ExpressionValue = new ConstantExpression(0), body: Expression = NoExpression.instance, breakVariable?: string, maxIterations?: number): ForExpression
  {
    return this.setParent(new ForExpression(variable, this.parse(start), this.parse(end), body, breakVariable, maxIterations));
  }

  public get(...path: ExpressionValue[]): GetExpression
  {
    return this.setParent(new GetExpression(this.parse(path)));
  }

  public sub(value: ExpressionValue, ...path: ExpressionValue[]): SubExpression
  {
    return this.setParent(new SubExpression(this.parse(value), this.parse(path)));
  }

  public computed(name: string, value: ExpressionValue): ComputedExpression
  {
    return this.setParent(new ComputedExpression(this.parse(value), name));
  }

  public if(condition: Expression, body: Expression = NoExpression.instance, otherwise: Expression = NoExpression.instance): IfExpression
  {
    return this.setParent(new IfExpression([[condition, body]], otherwise));
  }

  public invoke(name: string, args: Record<string, ExpressionValue> = {}): InvokeExpression
  {
    return this.setParent(new InvokeExpression(name, this.parse(args)));
  }

  public noop(): NoExpression
  {
    return NoExpression.instance;
  }

  public not(expr: Expression): NotExpression
  {
    return this.setParent(new NotExpression(expr));
  }

  public object(props: Record<string, ExpressionValue>): ObjectExpression
  {
    return this.setParent(new ObjectExpression(this.parse(props)));
  }

  public op<P extends string, O extends string, S extends string>(
    op: Operation<P, O, S, any, any>, 
    params: Record<P, ExpressionValue> & Partial<Record<O, ExpressionValue>>,
    scopeAlias: Partial<Record<S, string>> = Object.create(null)
  ): OperationExpression<P, O, S> {
    return this.setParent(new OperationExpression<P, O, S>(op.id, this.parse(params), scopeAlias));
  }

  public or(...exprs: Expression[]): OrExpression
  {
    return this.setParent(new OrExpression(exprs));
  }

  public return(value: ExpressionValue = NoExpression.instance): ReturnExpression
  {
    return this.setParent(new ReturnExpression(this.parse(value)));
  }

  public set(...path: ExpressionValue[]): SetExpression
  {
    return this.setParent(new SetExpression(this.parse(path), NoExpression.instance));
  }

  public switch<P extends string, O extends string, S extends string>(value: Expression, op: Operation<P, O, S, any, any>): SwitchExpression
  {
    return this.setParent(new SwitchExpression(value, op.id, [], NoExpression.instance));
  }

  public template(template: string, params: Record<string, ExpressionValue> = {}): TemplateExpression
  {
    return this.setParent(new TemplateExpression(template, this.parse(params)));
  }

  public tuple(...elements: ExpressionValue[]): TupleExpression
  {
    return this.setParent(new TupleExpression(this.parse(elements)));
  }

  public update(...path: ExpressionValue[]): UpdateExpression
  {
    return this.setParent(new UpdateExpression(this.parse(path), NoExpression.instance));
  }

  public while(condition: Expression, body: Expression = NoExpression.instance, breakVariable?: string, maxIterations?: number): WhileExpression
  {
    return this.setParent(new WhileExpression(condition, body, breakVariable, maxIterations));
  }

  public undefined()
  {
    return this.const(undefined);
  }

  public null()
  {
    return this.const(null);
  }

  public true()
  {
    return this.const(true);
  }

  public false()
  {
    return this.const(false);
  }

  public zero()
  {
    return this.const(0);
  }

  public one()
  {
    return this.const(1);
  }

  public compareEqual()
  {
    return this.const(1);
  }

  public compareLess()
  {
    return this.const(-1);
  }

  public compareGreater()
  {
    return this.const(+1);
  }

  public string()
  {
    return this.const('');
  }

  public comment(comment: string)
  {
    return new CommentExpression(comment);
  }

  public type(name: string)
  {
    return new GetTypeExpression(name);
  }

  public relation(name: string)
  {
    return new GetRelationExpression(name);
  }

}