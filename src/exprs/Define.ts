
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { isString } from '../fns';
import { AnyType } from '../types/Any';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { Exprs } from '../Exprs';


const INDEX_DEFINE = 1;
const INDEX_BODY = 2;

export class DefineExpression extends Expression 
{

  public static STEP_DEFINE = 'define';

  public static STEP_BODY = 'body';

  public static id = 'def';

  public static decode(data: any[], exprs: ExpressionProvider): DefineExpression 
  {
    const define = data[INDEX_DEFINE].map(([name, d]: [string, any]) => [name, exprs.getExpression(d)]);
    const body = exprs.getExpression(data[INDEX_BODY]);
    
    return new DefineExpression(define, body);
  }

  public static encode(expr: DefineExpression): any 
  {
    const define = expr.define.map(([name, defined]) => [name, defined.encode()]);

    return [this.id, define, expr.body.encode()];
  }

  public define: [string, Expression][];
  public body: Expression;

  public constructor(define: [string, Expression][], body: Expression) 
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
    return this.define.reduce((max, [name, e]) => Math.max(max, e.getComplexity(def, context)), this.body.getComplexity(def, context));
  }

  public getScope()
  {
    const scope = {};

    this.define.forEach(([name, defined]) => scope[name] = AnyType.baseType);

    return scope;
  }

  public encode(): any 
  {
    return DefineExpression.encode(this);
  }

  public clone(): Expression
  {
    return new DefineExpression(this.define.map(([name, variable]) => [name, variable.clone()]), this.body.clone());
  }

  public getType(def: DefinitionProvider, original: Type): Type | null
  {
    const { scope, context } = def.getContextWithScope(original);

    this.define.forEach(([name, defined]) => scope[name] = defined.getType(def, context));

    return this.body.getType(def, context);
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step(DefineExpression.STEP_DEFINE, () =>
        this.define.forEach(([name, defined], index) => 
          traverse.step(name, defined, (replaceWith) => this.define[index].splice(1, 1, replaceWith), () => this.define.splice(index, 1))
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
        ? [2, this.define.filter(([name]) => name === steps[1]).map(([_, expr]) => expr)[0]]
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

      defineContext.scope[name] = defined.getType(def, defineContext.context);
    });
    
    this.body.validate(def, defineContext.context, handler);
  }

  public with(name: string, value: ExpressionValue): DefineExpression
  public with(defines: Record<string, ExpressionValue>): DefineExpression
  public with(nameOrDefines: string | Record<string, ExpressionValue>, value?: Expression): DefineExpression
  {
    const append = isString(nameOrDefines)
      ? { [nameOrDefines]: value }
      : nameOrDefines;

    for (const name in append)
    {
      const expr = Exprs.parse(append[name]);
      const existing = this.define.find(([varName]) => varName === name);

      if (existing) {
        existing[1] = expr;
      } else {
        this.define.push([name, expr]);
      }

      expr.setParent(this);
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