
import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { objectMap, isString, objectEach } from '../fns';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';
import { Exprs } from '../Exprs';
import { DataTypes } from '../DataTypes';
import { PathExpression } from './Path';
import { ObjectInterface, ObjectType } from '../types/Object';
import { FunctionType } from '../types/Function';


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

  public getFunction(def: DefinitionProvider, context: Type, thisType?: Type): { type: FunctionType, expression?: Expression } | undefined
  {
    if (this.name)
    {
      const contextFunc = context.getChildType(this.name);

      if (contextFunc instanceof FunctionType)
      {
        return { type: contextFunc };
      }
      else
      {
        return def.getFunction(this.name);
      }
    }
    else if (thisType instanceof FunctionType)
    {
      return { type: thisType };
    }

    return undefined;
  }

  public getComplexity(def: DefinitionProvider, context: Type, thisType?: Type): number
  {
    const func = this.getFunction(def, context, thisType);

    return func?.expression
      ? func.expression.getComplexity(def, context, thisType)
      : 0;
  }

  public getScope(): undefined
  {
    return undefined;
  }

  public encode(): any 
  {
    return InvokeExpression.encode(this);
  }

  public clone(): Expression
  {
    return new InvokeExpression(this.name, objectMap(this.args, (a) => a.clone()));
  }

  public getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | undefined
  {
    const func = this.getFunction(def, context, thisType);

    if (!func)
    {
      return undefined;
    }

    const args = objectMap(this.args, (a) => a.getType(def, context));

    if (!func.type && func.expression)
    {
      return func.expression.getType(def, new ObjectType({ props: args }));
    }
    
    const overloaded = func.type.getOverloaded(args);
    const returns = overloaded.getReturnType();

    if (returns)
    {
      return returns;
    }

    if (func.expression)
    {
      return func.expression.getType(def, overloaded.getParamTypesType());
    }

    return undefined;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () =>
      objectEach(this.args, (expr, arg) =>
        traverse.step(arg, expr, (replaceWith) => this.args[arg] = replaceWith, () => DataTypes.objectRemove(this.args ,arg))
      )
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | undefined
  {
    return steps[0] in this.args
      ? [1, this.args[steps[0]]]
      : undefined;
  }

  public setParent(parent?: Expression): void
  {
    this.parent = parent;

    objectEach(this.args, e => e.setParent(this));
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler, thisType?: Type): void
  {
    const func = this.getFunction(def, context, thisType);
    
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
      const argTypes = objectMap(this.args, (a) => a.getType(def, context));
      const resolved = func.type.getOverloaded(argTypes);
      const paramTypes = resolved.getParamTypes();

      objectEach<ObjectInterface>(paramTypes, (param, paramName) =>
      {
        const arg = this.args[paramName];

        this.validateType(def, context, param, arg, handler);
      });
    }
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    const func = def.getFunction(this.name);

    if (!func)
    {
      return false;
    }

    for (const argName in this.args)
    {
      const argType = this.args[argName];

      if (argType.mutates(def, arg, directly) || (argType instanceof PathExpression && argType.isMutating(arg, true) && func.mutates(def, argName)))
      {
        return true;
      }
    }

    return false; 
  }

  public getInnerExpression(def: DefinitionProvider, context: any, parent?: any): Expression | string | false
  {
    const contextExpression = context[this.name];
    const expression = parent instanceof Expression
      ? parent
      : contextExpression instanceof Expression
        ? contextExpression
        : def.getFunction(this.name)?.expression;

    if (!expression)
    {
      return 'Function does not exist';
    }

    return expression;
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