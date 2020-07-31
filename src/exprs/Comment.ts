
import { Expression, ExpressionProvider } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Type } from '../Type';
import { Traverser } from '../Traverser';
import { ValidationHandler } from '../Validate';
import { NullType } from '../types/Null';


const INDEX_COMMENT = 1;

export class CommentExpression extends Expression 
{

  public static id = 'comment';

  public static readonly instance = new CommentExpression('');

  public static decode(data: any[], exprs: ExpressionProvider): CommentExpression 
  {
    const comment = data[INDEX_COMMENT];

    return new CommentExpression(comment);
  }

  public static encode(expr: CommentExpression): any 
  {
    return [this.id, expr.comment];
  }

  public comment: string;

  public constructor(comment: string)
  {
    super();
    this.comment = comment;
  }

  public getId(): string
  {
    return CommentExpression.id;
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
    return CommentExpression.encode(this);
  }

  public clone(): Expression
  {
    return new CommentExpression(this.comment);
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
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

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    
  }

  public isPathWritable(defs: DefinitionProvider): boolean
  {
    return false;
  }

  public mutates(def: DefinitionProvider, arg: string): boolean
  {
    return false;
  }

}