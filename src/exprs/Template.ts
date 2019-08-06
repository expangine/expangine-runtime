
import { mapObject } from '../fns';
import { Expression, ExpressionProvider } from '../Expression';


const INDEX_TEMPLATE = 1;
const INDEX_PARAMS = 2;

export class TemplateExpression extends Expression 
{

  public static id = 'tmpl';

  public static decode(data: any[], exprs: ExpressionProvider): TemplateExpression 
  {
    const template = data[INDEX_TEMPLATE];
    const params: Record<string, Expression> = mapObject(data[INDEX_PARAMS], value => exprs.getExpression(value));
    
    return new TemplateExpression(template, params);
  }

  public static encode(expr: TemplateExpression): any 
  {
    const params = mapObject(expr.params, e => e.encode());

    return [this.id, expr.template, params];
  }

  public template: string;
  public params: Record<string, Expression>;

  public constructor(template: string, params: Record<string, Expression>) 
  {
    super(TemplateExpression.id);
    this.template = template;
    this.params = params;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return TemplateExpression.encode(this);
  }

}