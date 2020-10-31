
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { isEmpty } from '../fns';
import { Type, TypeMap } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { DataTypes } from '../DataTypes';
import { PathExpression } from './Path';
import { FunctionType } from '../types/Function';
import { GetExpression } from './Get';
import { ConstantExpression } from './Constant';


const INDEX_TYPE = 1;
const INDEX_BODY = 2;
const INDEX_ALIASES = 3;

export class FunctionExpression extends Expression 
{

  public static STEP_BODY = 'body';

  public static id = 'func';

  public static decode(data: any[], exprs: ExpressionProvider): FunctionExpression 
  {
    const type = exprs.getType(data[INDEX_TYPE]) as FunctionType;
    const body = exprs.getExpression(data[INDEX_BODY]);
    const aliases = data[INDEX_ALIASES];
    
    return new FunctionExpression(type, body, aliases);
  }

  public static encode(expr: FunctionExpression): any 
  {
    const type = expr.type.encode();
    const body = expr.body.encode();

    return isEmpty(expr.aliases)
      ? [this.id, type, body]
      : [this.id, type, body, DataTypes.copy(expr.aliases)];
  }

  public type: FunctionType;
  public body: Expression;
  public aliases?: Record<string, string>;

  public constructor(type: FunctionType, body: Expression, aliases?: Record<string, string>) 
  {
    super();

    this.type = type;
    this.body = body;
    this.aliases = aliases;
  }

  public getId(): string
  {
    return FunctionExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return this.body.getComplexity(def, context);
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return FunctionExpression.encode(this);
  }

  public clone(): Expression
  {
    return new FunctionExpression(this.type.clone(), this.body.clone(), DataTypes.copy(this.aliases));
  }

  public getArgumentsAliased(): TypeMap
  {
    const args = this.type.getParamTypes();
    
    if (this.aliases)
    {
      for (const argName in this.aliases)
      {
        const aliasName = this.aliases[argName];

        args[aliasName] = args[argName];
        delete args[argName];
      }
    }

    return args;
  }

  public getBodyContext(def: DefinitionProvider, context: Type): Type
  {
    return def.getContext(context, this.getArgumentsAliased());
  }

  public getCaptured(context: Type): TypeMap
  {
    const local = this.getArgumentsAliased();
    const captured: TypeMap = {};

    this.body.traverse(new Traverser((expr) => 
    {
      if (expr instanceof PathExpression)
      {
        const path = expr.expressions;
        const p0 = path[0];
        const p1 = path[1];
        
        if (p0 instanceof GetExpression && p1 instanceof ConstantExpression && !(p1.value in local) && context.getChildType(p1.value))
        {
          captured[p1.value] = context.getChildType(p1.value);
        }
      }
    }));

    return captured;
  }

  public getType(def: DefinitionProvider, context: Type, thisType?: Type): Type | null
  {
    return thisType ? this.type : this.body.getType(def, context);
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(FunctionExpression.STEP_BODY, this.body, (replaceWith) => this.body = replaceWith);
    });
  }

  // tslint:disable: no-magic-numbers
  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === FunctionExpression.STEP_BODY
      ? [1, this.body]
      : null;
  }
  // tslint:enable: no-magic-numbers

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.body.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    const args = this.type.getParamTypes();
    const resolved = this.type.getOverloaded(args);

    if (resolved.getReturnType())
    {
      const bodyContext = this.getBodyContext(def, context);

      this.validateType(def, bodyContext, resolved.getReturnType(), this.body, handler);
    }

    this.body.validate(def, context, handler);
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    const { body, type } = this;
    const args = type.getParamTypes();

    for (const argName in args)
    {
      if (body.mutates(def, argName, false))
      {
        return true;
      }
    }

    return false; 
  }

  public getInnerExpression(def: DefinitionProvider): Expression | string | false
  {
    return this.body;
  }

}