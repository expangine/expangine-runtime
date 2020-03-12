
import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { objectMap, isString, objectEach } from '../fns';
import { Type, TypeMap } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';
import { Exprs } from '../Exprs';


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

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    const func = def.getFunction(this.name);

    if (!func)
    {
      return 0;
    }

    return func.expression.getComplexity(def, context);
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return InvokeExpression.encode(this);
  }

  public clone(): Expression
  {
    return new InvokeExpression(this.name, objectMap(this.args, (a) => a.clone()));
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    const func = def.getFunction(this.name);
    const argTypes = objectMap(this.args, (a) => a.getType(def, context));

    return func
      ? func.getReturnType(def, argTypes)
      : null;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () =>
      objectEach(this.args, (expr, arg) =>
        traverse.step(arg, expr, (replaceWith) => this.args[arg] = replaceWith, () => delete this.args[arg])
      )
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] in this.args
      ? [1, this.args[steps[0]]]
      : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    objectEach(this.args, e => e.setParent(this));
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
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

      objectEach(func.params.options.props, (param, paramName) =>
      {
        const arg = this.args[paramName];

        this.validateType(def, context, param, arg, handler);

        if (arg)
        {
          params[paramName] = arg.getType(def, context);
        }
      });

      // func.options.expression.validate(def, Types.object(params), handler);
    }
  }

  public named(name: string): InvokeExpression
  {
    this.name = name;

    return this;
  }

  public arg(name: string, value: ExpressionValue): InvokeExpression
  public arg(args: Record<string, ExpressionValue>): InvokeExpression
  public arg(nameOrArgs: string | Record<string, ExpressionValue>, value?: Expression): InvokeExpression
  {
    const append = isString(nameOrArgs)
      ? { [nameOrArgs]: value }
      : nameOrArgs;

    for (const argName in append)
    {
      const arg = Exprs.parse(append[argName]);

      this.args[argName] = arg;

      arg.setParent(this);
    }

    return this;
  }

}