
import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { Definitions } from '../Definitions';
import { objectMap, isString, toExpr, objectEach } from '../fns';
import { Type, TypeMap } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';
import { ObjectType } from '../types/Object';


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

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () =>
      objectEach(this.args, (expr, arg) =>
        traverse.step(arg, expr)
      )
    );
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    objectEach(this.args, e => e.setParent(this));
  }

  public validate(def: Definitions, context: Type, handler: ValidationHandler): void
  {
    const func = def.getFunction(this.name);
    
    if (!func) 
    {
      handler({
        type: ValidationType.MISSING_FUNCTION,
        severity: ValidationSeverity.HIGH,
        context,
        subject: this,
      });
    }
    else
    {
      const params: TypeMap = {};

      objectEach(func.options.params.options.props, (param, paramName) =>
      {
        const arg = this.args[paramName];

        this.validateType(def, context, param, arg, handler);

        if (arg)
        {
          params[paramName] = arg.getType(def, context);
        }
      });

      func.options.expression.validate(def, ObjectType.from(params), handler);
    }
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