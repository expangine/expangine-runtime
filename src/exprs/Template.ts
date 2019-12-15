
import { objectMap, isString, toExpr, objectEach } from '../fns';
import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { Definitions } from '../Definitions';
import { TextType } from '../types/Text';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler } from '../Validate';


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

  public getComplexity(def: Definitions): number
  {
    let complexity = 0;

    for (const prop in this.params)
    {
      complexity = Math.max(complexity, this.params[prop].getComplexity(def));
    }

    return complexity;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return TemplateExpression.encode(this);
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    return TextType.baseType.newInstance();
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () => 
      objectEach(this.params, (expr, param) =>
        traverse.step(param, expr)
      )
    );
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    objectEach(this.params, e => e.setParent(this));
  }

  public validate(def: Definitions, context: Type, handler: ValidationHandler): void
  {
    objectEach(this.params, subject =>
    {
      this.validateType(def, context, TextType.baseType, subject, handler);
    });
  }

  public param(name: string, value: ExpressionValue): TemplateExpression
  public param(params: Record<string, ExpressionValue>): TemplateExpression
  public param(nameOrParams: string | Record<string, ExpressionValue>, value?: Expression): TemplateExpression
  {
    const append = isString(nameOrParams)
      ? { [nameOrParams]: value }
      : nameOrParams;

    return new TemplateExpression(this.template, {
      ...this.params,
      ...toExpr(append),
    });
  }

}