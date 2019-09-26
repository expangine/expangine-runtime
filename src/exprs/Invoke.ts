
import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { Definitions } from '../Definitions';
import { objectMap, isString, toExpr } from '../fns';
import { Type } from '../Type';


const INDEX_NAME = 1;
const INDEX_ARGS = 2;

export class InvokeExpression extends Expression 
{

  public static id = 'invoke';

  public static decode(data: any[], exprs: ExpressionProvider): InvokeExpression 
  {
    const name = data[INDEX_NAME];
    const args = objectMap(data[INDEX_ARGS], e => exprs.getExpression(e));
    
    return new InvokeExpression(name, args);
  }

  public static encode(expr: InvokeExpression): any 
  {
    const args = objectMap(expr.args, a => a.encode());

    return [this.id, expr.name, args];
  }

  public name: string;
  public args: ExpressionMap;

  public constructor(name: string, args: ExpressionMap) 
  {
    super();
    this.name = name;
    this.args = args;
  }

  public getId(): string
  {
    return InvokeExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    const func = def.getFunction(this.name);

    if (!func)
    {
      throw new Error(`Function ${this.name} has not been defined.`);
    }

    return func.options.expression.getComplexity(def);
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return InvokeExpression.encode(this);
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    const func = def.getFunction(this.name);

    return func
      ? func.options.returnType
      : null;
  }

  public named(name: string): InvokeExpression
  {
    return new InvokeExpression(name, this.args);
  }

  public arg(name: string, value: ExpressionValue): InvokeExpression
  public arg(args: Record<string, ExpressionValue>): InvokeExpression
  public arg(nameOrArgs: string | Record<string, ExpressionValue>, value?: Expression): InvokeExpression
  {
    const append = isString(nameOrArgs)
      ? { [nameOrArgs]: value }
      : nameOrArgs;

    return new InvokeExpression(this.name, {
      ...this.args,
      ...toExpr(append),
    });
  }

}