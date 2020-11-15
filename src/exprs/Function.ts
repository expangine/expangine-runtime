
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { isArray, isEmpty, isNumber, isObject, isString } from '../fns';
import { Type, TypeChild, TypeMap } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { DataTypes } from '../DataTypes';
import { PathExpression } from './Path';
import { FunctionType } from '../types/Function';
import { GetExpression } from './Get';
import { ConstantExpression } from './Constant';
import { ObjectType } from '../types/Object';


const INDEX_TYPE = 1;
const INDEX_BODY = 2;
const INDEX_CAPTURED = 3;
const INDEX_ALIASES = 4;

export class FunctionExpression extends Expression 
{

  public static STEP_BODY = 'body';

  public static id = 'func';

  public static decode(data: any[], exprs: ExpressionProvider): FunctionExpression 
  {
    const type = exprs.getType(data[INDEX_TYPE]) as FunctionType;
    const body = exprs.getExpression(data[INDEX_BODY]);
    const captured = isArray(data[INDEX_CAPTURED]) ? data[INDEX_CAPTURED].slice() : [];
    const aliases = isObject(data[INDEX_ALIASES]) ? data[INDEX_ALIASES] : undefined;
    
    return new FunctionExpression(type, body, captured, aliases);
  }

  public static encode(expr: FunctionExpression): any 
  {
    const hasAliases = !isEmpty(expr.aliases);
    const out = [
      this.id, 
      expr.type.encode(), 
      expr.body.encode()
    ];

    if (expr.captured.length > 0 || hasAliases) {
      out.push(expr.captured.slice());
    }
    if (hasAliases) {
      out.push({ ...expr.aliases });
    }

    return out;
  }

  public type: FunctionType;
  public body: Expression;
  public captured: TypeChild[];
  public aliases?: Record<string, string>;

  public constructor(type: FunctionType, body: Expression, captured: TypeChild[] = [], aliases?: Record<string, string>) 
  {
    super();

    this.type = type;
    this.body = body;
    this.captured = captured;
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
    return new FunctionExpression(this.type.clone(), this.body.clone(), this.captured.slice(), DataTypes.copy(this.aliases));
  }

  public getAliased<T>(args: Record<string, T>): Record<string, T>
  {
    const out: Record<string, T> = {
      ...args,
    };

    if (this.aliases)
    {
      for (const argName in this.aliases)
      {
        const aliasName = this.aliases[argName];

        out[aliasName] = out[argName];
        delete out[argName];
      }
    }

    return out;
  }

  public getArgumentsAliased(): TypeMap
  {
    return this.getAliased( this.type.getParamTypes() );
  }

  public getBodyContext(def: DefinitionProvider, context: Type): Type
  {
    const props: TypeMap = {
      ...this.getArgumentsAliased(),
      ...this.getCapturedTypes(context),
    };

    return new ObjectType({ props });
  }

  public setCapturedFromContext(context: Type): void
  {
    this.captured = this.findCaptured( (child) => Boolean(context.getChildType(child)) );
  }

  public setCaptured(inContext: (child: TypeChild) => boolean): void
  {
    this.captured = this.findCaptured(inContext);
  }

  public getCapturedTypes(context: Type): TypeMap
  {
    return this.captured.reduce(
      (out, name) => {
        out[name] = context.getChildType(name);

        return out;
      },
      Object.create(null) as TypeMap,
    );
  }

  public findCaptured(inContext: (child: TypeChild) => boolean): TypeChild[]
  {
    const local = this.getArgumentsAliased();
    const captured: Record<TypeChild, true> = {};

    this.body.traverse(new Traverser((expr) => 
    {
      if (expr instanceof PathExpression)
      {
        const path = expr.expressions;
        const p0 = path[0];
        const p1 = path[1];
        
        if (p0 instanceof GetExpression && 
           p1 instanceof ConstantExpression && 
           !(p1.value in local) && 
           (isString(p1.value) || isNumber(p1.value)) &&
           inContext(p1.value))
        {
          captured[p1.value] = true;
        }
      }
    }));

    return Object.keys(captured);
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