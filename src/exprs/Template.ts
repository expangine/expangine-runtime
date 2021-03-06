
import { objectMap, isString, objectEach } from '../fns';
import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { TextType } from '../types/Text';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { Exprs } from '../Exprs';
import { DataTypes } from '../DataTypes';


const INDEX_TEMPLATE = 1;
const INDEX_PARAMS = 2;

export class TemplateExpression extends Expression 
{

  public static id = 'tmpl';

  public static decode(data: any[], exprs: ExpressionProvider): TemplateExpression 
  {
    const template = data[INDEX_TEMPLATE];
    const params: ExpressionMap = objectMap(data[INDEX_PARAMS], value => exprs.getExpression(value));
    
    return new TemplateExpression(template, params);
  }

  public static encode(expr: TemplateExpression): any 
  {
    const params = objectMap(expr.params, e => e.encode());

    return [this.id, expr.template, params];
  }

  public template: string;
  public params: ExpressionMap;

  public constructor(template: string, params: ExpressionMap) 
  {
    super();
    this.template = template;
    this.params = params;
  }

  public getId(): string
  {
    return TemplateExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    let complexity = 0;

    for (const prop in this.params)
    {
      complexity = Math.max(complexity, this.params[prop].getComplexity(def, context));
    }

    return complexity;
  }

  public getScope(): undefined
  {
    return undefined;
  }

  public encode(): any 
  {
    return TemplateExpression.encode(this);
  }

  public clone(): Expression
  {
    return new TemplateExpression(this.template, objectMap(this.params, (p) => p.clone()));
  }

  public getType(def: DefinitionProvider, context: Type): Type | undefined
  {
    return TextType.baseType.newInstance();
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => 
      objectEach(this.params, (expr, param) =>
        traverse.step(param, expr, (replaceWith) => this.params[param] = replaceWith, () => DataTypes.objectRemove(this.params, param))
      )
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | undefined
  {
    return steps[0] in this.params
      ? [1, this.params[steps[0]]]
      : undefined;
  }

  public setParent(parent?: Expression): void
  {
    this.parent = parent;

    objectEach(this.params, e => e.setParent(this));
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    objectEach(this.params, subject =>
    {
      this.validateType(def, context, TextType.baseType, subject, handler);
    });
  }

  public mutates(def: DefinitionProvider, arg: string, directly?: boolean): boolean
  {
    for (const param in this.params)
    {
      if (this.params[param].mutates(def, arg, directly))
      {
        return true;
      }
    }

    return false;
  }

  public param(name: string, value: ExpressionValue): TemplateExpression
  public param(params: Record<string, ExpressionValue>): TemplateExpression
  public param(nameOrParams: string | Record<string, ExpressionValue>, value?: Expression): TemplateExpression
  {
    const append = isString(nameOrParams)
      ? { [nameOrParams]: value }
      : nameOrParams;

    for (const paramName in append)
    {
      const param = Exprs.parse(append[paramName]);
      this.params[paramName] = param;
      param.setParent(this);
    }

    return this;
  }

}