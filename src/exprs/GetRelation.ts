
import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler, ValidationSeverity, ValidationType } from '../Validate';
import { NullType } from '../types/Null';
import { TypeRelation } from '../Relation';


const INDEX_NAME = 1;
const INDEX_SUBJECT = 2;

export class GetRelationExpression extends Expression 
{

  public static id = 'relation';

  public static readonly instance = new GetRelationExpression('', true);

  public static decode(data: any[], exprs: ExpressionProvider): GetRelationExpression 
  {
    const name = data[INDEX_NAME];
    const subject = data[INDEX_SUBJECT];

    return new GetRelationExpression(name, subject);
  }

  public static encode(expr: GetRelationExpression): any 
  {
    return [this.id, expr.name, expr.subject];
  }

  public name: string;
  public subject: boolean;

  public constructor(name: string, subject: boolean)
  {
    super();
    this.name = name;
    this.subject = subject;
  }

  public getId(): string
  {
    return GetRelationExpression.id;
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
    return GetRelationExpression.encode(this);
  }

  public getRelationType(def: Definitions, name: string): TypeRelation | null
  {
    const relation = def.relations[this.name];

    if (!relation)
    {
      return null;
    }

    return this.subject
      ? relation.getSubjectRelation(name)
      : relation.getRelatedRelation(name);
  }

  public getType(def: Definitions, context: Type): Type | null
  {
    return NullType.baseType;
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
        type: ValidationType.MISSING_RELATION_NAME,
        severity: ValidationSeverity.HIGH,
        context,
        parent: this,
      });
    }
    else if (!def.relations[this.name])
    {
      handler({
        type: ValidationType.MISSING_RELATION,
        severity: ValidationSeverity.HIGH,
        context,
        parent: this,
      });
    }
  }

}