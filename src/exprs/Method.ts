
import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { objectMap, isString, objectEach } from '../fns';
import { Type, TypeMap } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';
import { Exprs } from '../Exprs';
import { EntityType } from '../types/Entity';


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

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return MethodExpression.encode(this);
  }

  public clone(): Expression
  {
    return new MethodExpression(this.entity, this.name, objectMap(this.args, (a) => a.clone()));
  }

  public getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | null
  {
    if (!thisType || !(thisType instanceof EntityType) || thisType.options !== this.entity)
    {
      return null;
    }

    const entity = def.getEntity(this.entity);

    if (!entity)
    {
      return null;
    }

    const method = entity.methods[this.name];

    if (!method)
    {
      return null;
    }
    
    const argTypes = objectMap(this.args, (a) => a.getType(def, context));

    argTypes[Expression.INSTANCE] = entity.type;
    
    return method.getReturnType(def, argTypes);
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

    objectEach(method.params.options.props, (param, paramName) =>
    {
      const arg = this.args[paramName];

      this.validateType(def, context, param, arg, handler);

      if (arg)
      {
        params[paramName] = arg.getType(def, context);
      }
    });
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