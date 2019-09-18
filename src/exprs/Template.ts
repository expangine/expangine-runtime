
import { objectMap, isString, toExpr } from '../fns';
import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { Definitions } from '../Definitions';


const INDEX_TEMPLATE = 1;
const INDEX_PARAMS = 2;

export class TemplateExpression extends Expression 
{

  public static id = 'tmpl';

  public static decode(data: any[], exprs: ExpressionProvider): TemplateExpression 
  {
    const template = data[INDEX_TEMPLATE];
    const params: Record<string, Expression> = objectMap(data[INDEX_PARAMS], value => exprs.getExpression(value));
    
    return new TemplateExpression(template, params);
  }

  public static encode(expr: TemplateExpression): any 
  {
    const params = objectMap(expr.params, e => e.encode());

    return [this.id, expr.template, params];
  }

  public template: string;
  public params: Record<string, Expression>;

  public constructor(template: string, params: Record<string, Expression>) 
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