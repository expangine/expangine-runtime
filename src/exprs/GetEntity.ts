
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler, ValidationSeverity, ValidationType } from '../Validate';
import { EntityType } from '../types/Entity';


const INDEX_NAME = 1;

export class GetEntityExpression extends Expression 
{

  public static id = 'entity';

  public static readonly instance = new GetEntityExpression('');

  public static decode(data: any[], exprs: ExpressionProvider): GetEntityExpression 
  {
    const name = data[INDEX_NAME];

    return new GetEntityExpression(name);
  }

  public static encode(expr: GetEntityExpression): any 
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
    return GetEntityExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    return 0;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return GetEntityExpression.encode(this);
  }

  public clone(): Expression
  {
    return new GetEntityExpression(this.name);
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return new EntityType(this.name, def);
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
        type: ValidationType.MISSING_TYPE_NAME,
        severity: ValidationSeverity.HIGH,
        context,
        parent: this,
      });
    }
    else if (!def.getEntity(this.name))
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