
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler, ValidationSeverity, ValidationType } from '../Validate';
import { NullType } from '../types/Null';


const INDEX_NAME = 1;

export class GetTypeExpression extends Expression 
{

  public static id = 'type';

  public static readonly instance = new GetTypeExpression('');

  public static decode(data: any[], exprs: ExpressionProvider): GetTypeExpression 
  {
    const name = data[INDEX_NAME];

    return new GetTypeExpression(name);
  }

  public static encode(expr: GetTypeExpression): any 
  {
    return [this.id, expr.name];
  }

  public name: string;

  public constructor(name: string)
  {
    super();
    this.name = name;
  }

  public getId(): string
  {
    return GetTypeExpression.id;
  }

  public getComplexity(def: Definitions): number
  {
    return 0;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return GetTypeExpression.encode(this);
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    return def.aliased[this.name] || NullType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this);
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;
  }

  public validate(def: Definitions, context: Type, handler: ValidationHandler): void
  {
    if (!this.name)
    {
      handler({
        type: ValidationType.MISSING_TYPE_NAME,
        severity: ValidationSeverity.HIGH,
        context,
        parent: this,
      });
    }
    else if (!def.aliased[this.name])
    {
      handler({
        type: ValidationType.MISSING_TYPE,
        severity: ValidationSeverity.HIGH,
        context,
        parent: this,
      });
    }
  }

}