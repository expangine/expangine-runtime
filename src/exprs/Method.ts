
import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { objectMap, isString, objectEach } from '../fns';
import { Type, TypeMap } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';
import { Exprs } from '../Exprs';
import { EntityType } from '../types/Entity';
import { DataTypes } from '../DataTypes';
import { PathExpression } from './Path';
import { ObjectInterface } from '../types/Object';


const INDEX_ENTITY = 1;
const INDEX_NAME = 2;
const INDEX_ARGS = 3;

export class MethodExpression extends Expression 
{

  public static id = 'method';

  public static decode(data: any[], exprs: ExpressionProvider): MethodExpression 
  {
    const entity = data[INDEX_ENTITY];
    const name = data[INDEX_NAME];
    const args = objectMap(data[INDEX_ARGS], e => exprs.getExpression(e));
    
    return new MethodExpression(entity, name, args);
  }

  public static encode(expr: MethodExpression): any 
  {
    const args = objectMap(expr.args, a => a.encode());

    return [this.id, expr.entity, expr.name, args];
  }

  public entity: string;
  public name: string;
  public args: ExpressionMap;

  public constructor(entity: string, name: string, args: ExpressionMap) 
  {
    super();
    this.entity = entity;
    this.name = name;
    this.args = args;
  }

  public getId(): string
  {
    return MethodExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    const entity = def.getEntity(this.entity);

    if (!entity || !entity.methods[this.name])
    {
      return 0;
    }

    return entity.methods[this.name].expression.getComplexity(def, context);
  }

  public getScope(): undefined
  {
    return undefined;
  }

  public encode(): any 
  {
    return MethodExpression.encode(this);
  }

  public clone(): Expression
  {
    return new MethodExpression(this.entity, this.name, objectMap(this.args, (a) => a.clone()));
  }

  public getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | undefined
  {
    if (!thisType || !(thisType instanceof EntityType) || thisType.options !== this.entity)
    {
      return undefined;
    }

    const entity = def.getEntity(this.entity);

    if (!entity)
    {
      return undefined;
    }

    const method = entity.methods[this.name];

    if (!method)
    {
      return undefined;
    }
    
    const argTypes = objectMap(this.args, (a) => a.getType(def, context));

    argTypes[Expression.INSTANCE] = entity.type;
    
    return method.getReturnType(def, context, argTypes);
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () =>
      objectEach(this.args, (expr, arg) =>
        traverse.step(arg, expr, (replaceWith) => this.args[arg] = replaceWith, () => DataTypes.objectRemove(this.args, arg))
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
    if (!thisType || !(thisType instanceof EntityType) || thisType.options !== this.entity)
    {
      handler({
        type: ValidationType.INVALID_THIS,
        severity: ValidationSeverity.HIGH,
        context,
        subject: this,
      });

      return;
    }

    const entity = def.getEntity(this.entity);

    if (!entity)
    {
      handler({
        type: ValidationType.MISSING_TYPE,
        severity: ValidationSeverity.HIGH,
        context,
        subject: this,
      });

      return;
    }

    const method = entity.methods[this.name];

    if (!method)
    {
      handler({
        type: ValidationType.MISSING_METHOD,
        severity: ValidationSeverity.HIGH,
        context,
        subject: this,
      });

      return;
    }

    const params: TypeMap = {};

    params[Expression.INSTANCE] = entity.type;

    objectEach<ObjectInterface>(method.type.options.params, (param, paramName) =>
    {
      const arg = this.args[paramName];

      this.validateType(def, context, param, arg, handler);

      if (arg)
      {
        const argType = arg.getType(def, context);

        if (argType)
        {
          params[paramName] = argType;
        }
      }
    });
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    const entity = def.getEntity(this.entity);

    if (!entity)
    {
      return false;
    }

    const method = entity.methods[this.name];

    if (!method)
    {
      return false;
    }

    for (const argName in this.args)
    {
      const argType = this.args[argName];

      if (argType.mutates(def, arg, directly) || (argType instanceof PathExpression && argType.isMutating(arg, true) && method.mutates(def, argName)))
      {
        return true;
      }
    }

    return false;
  }

  public getInnerExpression(def: DefinitionProvider, context: any, parent?: any): Expression | string | false
  {
    const entity = def.getEntity(this.entity);

    if (!entity)
    {
      return `Entity "${this.entity}" does not exist`;
    }

    const method = entity.methods[this.name];

    if (!method)
    {
      return `Method "${this.name}" on Entity "${this.entity}" does not exist`;
    }

    return method.expression;
  }

  public isPathNode(): boolean
  {
    return true;
  }

  public named(name: string): MethodExpression
  {
    this.name = name;

    return this;
  }

  public arg(name: string, value: ExpressionValue): MethodExpression
  public arg(args: Record<string, ExpressionValue>): MethodExpression
  public arg(nameOrArgs: string | Record<string, ExpressionValue>, value?: Expression): MethodExpression
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