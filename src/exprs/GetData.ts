
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler, ValidationSeverity, ValidationType } from '../Validate';
import { NullType } from '../types/Null';


const INDEX_NAME = 1;

export class GetDataExpression extends Expression 
{

  public static id = 'data';

  public static readonly instance = new GetDataExpression('');

  public static decode(data: any[], exprs: ExpressionProvider): GetDataExpression 
  {
    const name = data[INDEX_NAME];

    return new GetDataExpression(name);
  }

  public static encode(expr: GetDataExpression): any 
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
    return GetDataExpression.id;
  }

  public getComplexity(def: DefinitionProvider): number
  {
    return 0;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return GetDataExpression.encode(this);
  }

  public clone(): Expression
  {
    return new GetDataExpression(this.name);
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    const data = def.getData(this.name);

    return data ? data.dataType : NullType.baseType;
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this);
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    if (!this.name)
    {
      handler({
        type: ValidationType.MISSING_DATA_NAME,
        severity: ValidationSeverity.HIGH,
        context,
        parent: this,
      });
    }
    else if (!def.getData(this.name))
    {
      handler({
        type: ValidationType.MISSING_DATA,
        severity: ValidationSeverity.HIGH,
        context,
        parent: this,
      });
    }
  }

}