
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';
import { isNumber } from '../fns';
import { GetExpression } from './Get';
import { ConstantExpression } from './Constant';
import { SetExpression } from './Set';


const INDEX_PATH = 1;

export class PathExpression extends Expression 
{

  public static id = 'path';

  public static decode(data: any[], exprs: ExpressionProvider): PathExpression 
  {
    const expressions = data[INDEX_PATH].map((e: any) => exprs.getExpression(e));
    
    return new PathExpression(expressions);
  }

  public static encode(expr: PathExpression): any 
  {
    return [this.id, expr.expressions.map((e) => e.encode())];
  }

  public static createForLegacy(path: Expression[])
  {
    for (let i = path.length - 1; i >= 0; i--)
    {
      const node = path[i];

      if (node instanceof PathExpression)
      {
        if (node.expressions.length === 0 || !node.expressions[0].isPathStart())
        {
          path.splice(i, 1, ...node.expressions);
        }
      }
    }

    return new PathExpression(path);
  }

  public static fromPartial(pathData: any[], exprs: ExpressionProvider)
  {
    const isPath = pathData[0] === PathExpression.id;
    const path = isPath
      ? PathExpression.decode(pathData, exprs)
      : PathExpression.decode(['path', [new GetExpression(), ...pathData]], exprs);

    if (isPath) {
      exprs.setLegacy();
    }

    return path;
  }

  public expressions: Expression[];

  public constructor(expressions: Expression[]) 
  {
    super();

    this.expressions = expressions;
  }

  public getId(): string
  {
    return PathExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    let max = 0;
    let thisType = context;

    for (const expr of this.expressions)
    {
      const complexity = expr.getComplexity(def, context, thisType);

      if (complexity > max)
      {
        max = complexity;
      }

      thisType = expr.getType(def, context, thisType);
    }

    return max;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return PathExpression.encode(this);
  }

  public clone(): PathExpression
  {
    return new PathExpression(this.expressions.map((e) => e.clone()));
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return def.getPathType(this.expressions, context);
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => 
      this.expressions.forEach((expr, index) => 
        traverse.step(index, expr, (replaceWith) => this.expressions.splice(index, 1, replaceWith), () => this.expressions.splice(index, 1))
      )
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return isNumber(steps[0]) && steps[0] < this.expressions.length
      ? [1, this.expressions[steps[0]]]
      : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;
    
    this.expressions.forEach(e => e.setParent(this));
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    const path = this.expressions;

    if (path.length === 0)
    {
      handler({
        type: ValidationType.EMPTY_PATH,
        severity: ValidationSeverity.HIGH,
        context,
        subject: this,
      });

      return;
    }

    let thisType = path[0].getType(def, context);

    if (!thisType)
    {
      handler({
        type: ValidationType.INVALID_EXPRESSION,
        severity: ValidationSeverity.HIGH,
        context,
        subject: path[0],
        parent: this,
      });
    }
    else
    {
      path[0].validate(def, context, handler);

      for (let i = 1; i < path.length; i++)
      {
        const node = path[i];

        node.validate(def, context, handler, thisType);

        thisType = node.isPathNode()
          ? node.getType(def, context, thisType)
          : thisType.getSubType(node, def, context);

        if (!thisType)
        {
          handler({
            type: ValidationType.INVALID_EXPRESSION,
            severity: ValidationSeverity.HIGH,
            context,
            subject: node,
            parent: this,
          });
          
          break;
        }
      }
    }
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    for (const expr of this.expressions)
    {
      if (expr.mutates(def, arg, directly))
      {
        return true;
      }
    }

    return false;
  }

  public isWritable(defs: DefinitionProvider)
  {
    return this.expressions.length > 0
      ? this.expressions[this.expressions.length - 1].isPathWritable(defs)
      : false;
  }

  public isMutating(arg: string, directly: boolean = false): boolean
  {
    const e0 = this.expressions[0];
    const e1 = this.expressions[1];
    const e2 = this.expressions[2]; // tslint:disable-line: no-magic-numbers

    if (!(e0 instanceof GetExpression && e1 instanceof ConstantExpression && e1.value === arg))
    {
      return false;
    }

    return directly ? true : !!e2;
  }

  public set(value: Expression, currentVariable?: string): SetExpression
  {
    return new SetExpression(this.clone(), value, currentVariable);
  }

}