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
import { GetDataExpression } from './exprs/GetData';
import { GetEntityExpression } from './exprs/GetEntity';
import { GetRelationExpression } from './exprs/GetRelation';
import { IfExpression } from './exprs/If';
import { InvokeExpression } from './exprs/Invoke';
import { MethodExpression } from './exprs/Method';
import { OperationExpression } from './exprs/Operation';
import { Operation } from './Operation';
import { OrExpression } from './exprs/Or';
import { PathExpression } from './exprs/Path';
import { ReturnExpression } from './exprs/Return';
import { SetExpression } from './exprs/Set';
import { SwitchExpression } from './exprs/Switch';
import { TemplateExpression } from './exprs/Template';
import { UpdateExpression } from './exprs/Update';
import { WhileExpression } from './exprs/While';
import { TupleExpression } from './exprs/Tuple';
import { ObjectExpression } from './exprs/Object';
import { isArray, isObject, objectMap } from './fns';
import { Type } from './Type';


export class Exprs
{

  public static autoSetParent: boolean = true;

  public static setParent<E extends Expression>(expr: E, force: boolean = false): E
  {
    if (this.autoSetParent || force)
    {
      expr.setParent();
    }

    return expr;
  }

  public static parse(values: ExpressionValue[]): Expression[]
  public static parse(values: Record<string, ExpressionValue>): ExpressionMap
  public static parse(value: ExpressionValue): Expression
  public static parse(value: ExpressionValue | ExpressionValue[] | Record<string, ExpressionValue>): Expression | Expression[] | ExpressionMap
  {
    return isArray(value)
      ? value.map((v) => this.parse(v))
      : value instanceof Expression 
        ? value
        : isObject(value)
          ? objectMap<Expression, ExpressionValue>(value, (v) => this.parse(v))
          : new ConstantExpression(value);
  }

  public static cast(valueType: Type, targetType: Type): Expression;
  public static cast(valueType: Type, targetType: Type, createOnMissing: false): Expression | null;
  public static cast(valueType: Type, targetType: Type, createOnMissing: boolean = true): Expression
  {
    const opId = `${valueType.getId()}:~${targetType.getId()}`;
    const op = valueType.getOperations()[opId];

    return op
      ? this.op(op, { value: this.get('value') })
      : createOnMissing
        ? this.setParent(targetType.getCreateExpression())
        : null as unknown as Expression;
  }

  public static and(...exprs: Expression[]): AndExpression
  {
    return this.setParent(new AndExpression(exprs));
  }

  public static body(...exprs: Expression[]): ChainExpression
  {
    return this.setParent(new ChainExpression(exprs));
  }

  public static const(value: any): ConstantExpression
  {
    return new ConstantExpression(value);
  }

  public static define(vars: Record<string, ExpressionValue> = {}, body: Expression = NoExpression.instance): DefineExpression
  {
    return this.setParent(new DefineExpression([], body).with(vars));
  }

  public static do(body: Expression, condition: Expression = NoExpression.instance, breakVariable?: string, maxIterations?: number): DoExpression
  {
    return this.setParent(new DoExpression(condition, body, breakVariable, maxIterations));
  }

  public static for(variable: string, start: ExpressionValue = new ConstantExpression(0), end: ExpressionValue = new ConstantExpression(0), body: Expression = NoExpression.instance, breakVariable?: string, maxIterations?: number): ForExpression
  {
    return this.setParent(new ForExpression(variable, this.parse(start), this.parse(end), body, breakVariable, maxIterations));
  }

  public static get(): GetExpression
  public static get(...path: ExpressionValue[]): PathExpression
  public static get(...path: ExpressionValue[]): PathExpression | GetExpression
  {
    return path.length === 0
      ? new GetExpression()
      : this.setParent(new PathExpression([new GetExpression(), ...this.parse(path)]));
  }

  public static sub(value: ExpressionValue, ...path: ExpressionValue[]): PathExpression
  {
    return this.setParent(new PathExpression([this.parse(value), ...this.parse(path)]));
  }

  public static computed(name: string): ComputedExpression
  {
    return this.setParent(new ComputedExpression(name));
  }

  public static if(condition: Expression, body: Expression = NoExpression.instance, otherwise: Expression = NoExpression.instance): IfExpression
  {
    return this.setParent(new IfExpression([[condition, body]], otherwise));
  }

  public static invoke(name: string, args: Record<string, ExpressionValue> = {}): InvokeExpression
  {
    return this.setParent(new InvokeExpression(name, this.parse(args)));
  }

  public static method(entity: string, name: string, args: Record<string, ExpressionValue> = {}): InvokeExpression
  {
    return this.setParent(new MethodExpression(entity, name, this.parse(args)));
  }

  public static noop(): NoExpression
  {
    return NoExpression.instance;
  }

  public static not(expr: Expression): NotExpression
  {
    return this.setParent(new NotExpression(expr));
  }

  public static object(props: Record<string, ExpressionValue>): ObjectExpression
  {
    return this.setParent(new ObjectExpression(this.parse(props)));
  }

  public static op<P extends string, O extends string, S extends string>(
    op: Operation<P, O, S, any, any>, 
    params: Record<P, ExpressionValue> & Partial<Record<O, ExpressionValue>>,
    scopeAlias: Partial<Record<S, string>> = Object.create(null)
  ): OperationExpression<P, O, S> {
    return this.setParent(new OperationExpression<P, O, S>(op.id, this.parse(params), scopeAlias));
  }

  public static or(...exprs: Expression[]): OrExpression
  {
    return this.setParent(new OrExpression(exprs));
  }

  public static path(...exprs: ExpressionValue[]): PathExpression
  {
    return this.setParent(exprs.length === 1 && exprs[0] instanceof PathExpression
      ? exprs[0]
      : new PathExpression(this.parse(exprs)));
  }

  public static return(value: ExpressionValue = NoExpression.instance): ReturnExpression
  {
    return this.setParent(new ReturnExpression(this.parse(value)));
  }

  public static set(...path: ExpressionValue[]): SetExpression
  {
    return this.setParent(new SetExpression(this.path(...path), NoExpression.instance));
  }

  public static switch<P extends string, O extends string, S extends string>(value: Expression, op: Operation<P, O, S, any, any>): SwitchExpression
  {
    return this.setParent(new SwitchExpression(value, op.id, [], NoExpression.instance));
  }

  public static template(template: string, params: Record<string, ExpressionValue> = {}): TemplateExpression
  {
    return this.setParent(new TemplateExpression(template, this.parse(params)));
  }

  public static tuple(...elements: ExpressionValue[]): TupleExpression
  {
    return this.setParent(new TupleExpression(this.parse(elements)));
  }

  public static update(...path: ExpressionValue[]): UpdateExpression
  {
    return this.setParent(new UpdateExpression(this.path(...path), NoExpression.instance));
  }

  public static while(condition: Expression, body: Expression = NoExpression.instance, breakVariable?: string, maxIterations?: number): WhileExpression
  {
    return this.setParent(new WhileExpression(condition, body, breakVariable, maxIterations));
  }

  public static undefined()
  {
    return this.const(undefined);
  }

  public static null()
  {
    return this.const(null);
  }

  public static true()
  {
    return this.const(true);
  }

  public static false()
  {
    return this.const(false);
  }

  public static zero()
  {
    return this.const(0);
  }

  public static one()
  {
    return this.const(1);
  }

  public static compareEqual()
  {
    return this.const(1);
  }

  public static compareLess()
  {
    return this.const(-1);
  }

  public static compareGreater()
  {
    return this.const(+1);
  }

  public static string()
  {
    return this.const('');
  }

  public static comment(comment: string)
  {
    return new CommentExpression(comment);
  }

  public static entity(name: string)
  {
    return new GetEntityExpression(name);
  }

  public static relation(name: string)
  {
    return new GetRelationExpression(name);
  }

  public static data(name: string)
  {
    return new GetDataExpression(name);
  }

}