
import { isArray, mapObject } from './fns';
import { Type, TypeClass, TypeParser } from './Type';
import { Expression, ExpressionClass } from './Expression';
import { Operations, OperationBuilder } from './Operation';
import { ConstantExpression } from './exprs/Constant';


interface DefinitionsOptions
{
  types?: TypeClass[];
  expressions?: ExpressionClass[];
  aliases?: Record<string, Type | any>;
}

export class Definitions 
{

  public types: Record<string, TypeClass>;
  public parsers: Record<string, TypeParser>;
  public expressions: Record<string, ExpressionClass>;
  public operations: Operations<any>;

  public constructor(initial?: DefinitionsOptions)
  { 
    this.types = Object.create(null);
    this.expressions = Object.create(null);
    this.parsers = Object.create(null);
    this.operations = new Operations('');

    if (initial) 
    {
      if (initial.types) 
      {
        initial.types.forEach(type => this.addType(type));
      }

      if (initial.expressions) 
      {
        initial.expressions.forEach(expr => this.addExpression(expr));
      }

      if (initial.aliases) 
      {
        mapObject(initial.aliases, (instance, alias) => this.addAlias(alias, instance));
      }
    }
  }

  public addType<T extends Type>(type: TypeClass<T>) 
  {
    this.types[type.id] = type;
    this.parsers[type.id] = (data, types) => type.decode(data, types);
  }

  public addAlias<T extends Type>(alias: string, instance: T | any) 
  {
    const type = instance instanceof Type
      ? instance
      : this.getType(instance);

    this.parsers[alias] = () => type;
  }

  public getType(value: any): Type 
  {
    const id = isArray(value) ? value[0] : value;
    const data = isArray(value) ? value : [];

    return this.parsers[id](data, this);
  }

  public getOperationBuilder(id: string): OperationBuilder<any> | null
  {
    const op = this.operations.getBuilder(id);

    if (op)
    {
      return op;
    }

    const [typeName] = id.split(':');
    const type = this.types[typeName];

    return type ? type.operations.getBuilder(id) : null;
  }

  public addExpression<T extends Expression>(expr: ExpressionClass<T>) 
  {
    this.expressions[expr.id] = expr;
  }

  public getExpression(value: any): Expression 
  {
    if (isArray(value))
    {
      const exprClass = this.expressions[value[0]];

      if (!exprClass)
      {
        throw new Error('An expression was not found for: ' + JSON.stringify(value));
      }

      return exprClass.decode(value, this);
    }

    return new ConstantExpression(value);
  }

}