
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler, ValidationSeverity, ValidationType } from '../Validate';
import { EnumType } from '../types/Enum';
import { TextType } from '../types/Text';


const INDEX_NAME = 1;

export class GetRelationExpression extends Expression 
{

  public static id = 'relation';

  public static readonly instance = new GetRelationExpression('');

  public static decode(data: any[], exprs: ExpressionProvider): GetRelationExpression 
  {
    const name = data[INDEX_NAME];

    return new GetRelationExpression(name);
  }

  public static encode(expr: GetRelationExpression): any 
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
    return GetRelationExpression.id;
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
    return GetRelationExpression.encode(this);
  }

  public clone(): Expression
  {
    return new GetRelationExpression(this.name);
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return new EnumType({
      key: TextType.baseType,
      value: TextType.baseType,
      constants: new Map([
        ['relation', this.name],
      ])
    });
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
        type: ValidationType.MISSING_RELATION_NAME,
        severity: ValidationSeverity.HIGH,
        context,
        parent: this,
      });
    }
    else if (!def.getRelation(this.name))
    {
      handler({
        type: ValidationType.MISSING_RELATION,
        severity: ValidationSeverity.HIGH,
        context,
        parent: this,
      });
    }
  }

  public mutates(def: DefinitionProvider, arg: string): boolean
  {
    return false; 
  }

}