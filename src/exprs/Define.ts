
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { isArray, isObject, isString } from '../fns';
import { AnyType } from '../types/Any';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type, TypeMap } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { Exprs } from '../Exprs';


const INDEX_DEFINE = 1;
const INDEX_BODY = 2;

export type DefineVar = string | Record<string, string | number>;

export class DefineExpression extends Expression 
{

  public static STEP_DEFINE = 'define';

  public static STEP_BODY = 'body';

  public static id = 'def';

  public static decode(data: any[], exprs: ExpressionProvider): DefineExpression 
  {
    const define = data[INDEX_DEFINE].map(([name, d]: [DefineVar, any]) => [this.cloneVar(name), exprs.getExpression(d)]);
    const body = exprs.getExpression(data[INDEX_BODY]);
    
    return new DefineExpression(define, body);
  }

  public static encode(expr: DefineExpression): any 
  {
    const define = expr.define.map(([name, defined]) => [this.cloneVar(name), defined.encode()]);

    return [this.id, define, expr.body.encode()];
  }

  public static cloneVar(v: DefineVar): DefineVar
  {
    return isObject(v) ? { ...v } : v;
  }

  public static stringifyVar(v: DefineVar): string
  {
    return isString(v) ? v : Object.keys(v).sort().join(',');
  }

  public define: [DefineVar, Expression][];
  public body: Expression;

  public constructor(define: [DefineVar, Expression][], body: Expression) 
  {
    super();
    this.define = define;
    this.body = body;
  }

  public getId(): string
  {
    return DefineExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return this.define.reduce((max, [_, e]) => Math.max(max, e.getComplexity(def, context)), this.body.getComplexity(def, context));
  }

  public isDynamic(): boolean
  {
    return this.body.isDynamic();
  }

  public applyToScope(scope: TypeMap, name: DefineVar, type: Type)
  {
    if (isString(name))
    {
      scope[name] = type;
    }
    else
    {
      for (const n in name)
      {
        scope[n] = type.getChildType(name[n]) || AnyType.baseType;
      }
    }
  }

  public getScope()
  {
    const scope = {};

    this.define.forEach(([name, defined]) => 
    {
      this.applyToScope(scope, name, AnyType.baseType);
    });

    return scope;
  }

  public encode(): any 
  {
    return DefineExpression.encode(this);
  }

  public clone(): Expression
  {
    return new DefineExpression(this.define.map(([name, variable]) => [DefineExpression.cloneVar(name), variable.clone()]), this.body.clone());
  }

  public getType(def: DefinitionProvider, original: Type): Type | null
  {
    const { scope, context } = def.getContextWithScope(original);

    this.define.forEach(([name, defined]) => 
    {
      this.applyToScope(scope, name, defined.getType(def, context));
    });

    return this.body.getType(def, context);
  }

  public getContextFor(steps: TraverseStep[], def: DefinitionProvider, context: Type, thisType?: Type): Type
  {
    const inner = def.getContextWithScope(context);

    for (const [name, defined] of this.define) 
    {
      if (steps[0] === DefineExpression.STEP_DEFINE && steps[1] === DefineExpression.stringifyVar(name)) 
      {
        break;
      }

      this.applyToScope(inner.scope, name, defined.getType(def, inner.context));
    }

    return inner.context;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(DefineExpression.STEP_DEFINE, () =>
        this.define.forEach(([name, defined], index) => 
          traverse.step(DefineExpression.stringifyVar(name), defined, (replaceWith) => this.define[index].splice(1, 1, replaceWith), () => this.define.splice(index, 1))
        )
      );
      traverse.step(DefineExpression.STEP_BODY, this.body, (replaceWith) => this.body = replaceWith);
    });
  }

  // tslint:disable: no-magic-numbers
  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] === DefineExpression.STEP_BODY
      ? [1, this.body]
      : steps[0] === DefineExpression.STEP_DEFINE
        ? [2, this.define.filter(([name]) => DefineExpression.stringifyVar(name) === steps[1]).map(([_, expr]) => expr)[0]]
        : null;
  }
  // tslint:enable: no-magic-numbers

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    this.define.forEach(([name, defined]) => defined.setParent(this));
    this.body.setParent(this);
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    const defineContext = def.getContextWithScope(context);

    this.define.forEach(([name, defined]) => 
    {
      defined.validate(def, defineContext.context, handler);

      this.applyToScope(defineContext.scope, name, defined.getType(def, defineContext.context));
    });
    
    this.body.validate(def, defineContext.context, handler);
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    for (const [, defined] of this.define)    
    {
      if (defined.mutates(def, arg, directly))
      {
        return true;
      }
    }

    return this.body.mutates(def, arg, directly);
  }

  public with(name: DefineVar, value: ExpressionValue): DefineExpression
  public with(defines: Record<string, ExpressionValue> | Array<[DefineVar, ExpressionValue]>): DefineExpression
  public with(nameOrDefines: DefineVar | Record<string, ExpressionValue> | Array<[DefineVar, ExpressionValue]>, value?: ExpressionValue): DefineExpression
  {
    const add = (name: DefineVar, exprValue: ExpressionValue) =>
    {
      const expr = Exprs.parse(exprValue);
      const existing = this.define.find(([varName]) => DefineExpression.stringifyVar(varName) === DefineExpression.stringifyVar(name));

      if (existing)
      {
        existing[1] = expr;
      }
      else
      {
        this.define.push([name, expr]);
      }

      expr.setParent(this);
    };

    if (value !== undefined)
    {
      add(name, value);
    }
    else if (isArray(nameOrDefines))
    {
      for (const [name, define] of nameOrDefines)
      {
        add(name, define);
      }
    }
    else if (isObject(nameOrDefines))
    {
      for (const name in nameOrDefines)
      {
        add(name, nameOrDefines[name]);
      }
    }

    return this;
  }

  public run(expr: Expression): DefineExpression
  {
    this.body = expr;
    this.body.setParent(this);

    return this;
  }

}