
import { isArray, mapObject, isSameClass } from './fns';
import { Type, TypeClass, TypeParser } from './Type';
import { Expression, ExpressionClass } from './Expression';
import { Operations, OperationBuilder } from './Operation';
import { ConstantExpression } from './exprs/Constant';
import { AnyType } from './types/Any';
import { OptionalType } from './types/Optional';
import { ManyType } from './types/Many';


interface DefinitionsOptions
{
  types?: TypeClass[];
  expressions?: ExpressionClass[];
  aliases?: Record<string, Type | any>;
}

export class Definitions 
{

  public types: Record<string, TypeClass>;
  public describers: TypeClass[];
  public parsers: Record<string, TypeParser>;
  public expressions: Record<string, ExpressionClass>;
  public operations: Operations<any>;

  public constructor(initial?: DefinitionsOptions)
  { 
    this.types = Object.create(null);
    this.expressions = Object.create(null);
    this.parsers = Object.create(null);
    this.describers = [];
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

  public describe(data: any): Type
  {
    for (const describer of this.describers)
    {
      const type = describer.describe(data, this);

      if (type)
      {
        return type;
      }
    }

    return AnyType.baseType;
  }

  public merge(type: Type, data: any): Type
  {
    return this.mergeType(type, this.describe(data));
  }

  public mergeType(a: Type, b: Type): Type
  {
    if (a instanceof AnyType)
    {
      return b;
    }

    const optional = 
      a instanceof OptionalType ||
      b instanceof OptionalType;

    const ar = this.requiredType(a);
    const br = this.requiredType(b);

    if (isSameClass(ar, br))
    {
      ar.merge(br, this);

      return optional ? new OptionalType(ar) : ar;
    }

    if (ar instanceof ManyType || br instanceof ManyType)
    {
      const atypes = this.getTypes(ar);
      const btypes = this.getTypes(br);
      const an = atypes.length;

      for (const ktype of btypes)
      {
        let matched = false;
        const koptional = ktype instanceof OptionalType;
        const krequired = koptional ? ktype.options : ktype;

        for (let i = 0; i < an; i++)
        {
          const itype = atypes[i];
          const ioptional = itype instanceof OptionalType;
          const irequired = ioptional ? itype.options : itype;

          if (isSameClass(irequired, krequired))
          {
            matched = true;
            irequired.merge(krequired, this);

            if (koptional && !ioptional) 
            {
              atypes[i] = new OptionalType(irequired);
            }
          }
        }

        if (!matched)
        {
          atypes.push(ktype);
        }
      }

      return optional
        ? new OptionalType(this.getReducedType(atypes))
        : this.getReducedType(atypes);
    }

    return new ManyType([ a, b ]);
  }

  public optionalType(type: Type): Type
  {
    if (type instanceof OptionalType)
    {
      return type;
    }

    if (type instanceof ManyType)
    {
      type.options = type.options.map(t => this.requiredType(t));
    }

    return new OptionalType(type);
  }

  public requiredType(type: Type): Type
  {
    return (type instanceof OptionalType) ? type.options : type;
  }

  public getTypes(type: Type): Type[]
  {
    return (type instanceof ManyType) ? type.options : [type];
  }

  public getReducedType(type: Type[]): Type
  {
    return type.length === 1 ? type[0] : new ManyType(type);
  }

  public sortDescribers()
  {
    this.describers.sort((a, b) => b.describePriority - a.describePriority);
  }

  public addType<T extends Type>(type: TypeClass<T>) 
  {
    this.types[type.id] = type;
    this.parsers[type.id] = (data, types) => type.decode(data, types);
    this.describers.push(type);
    this.sortDescribers();
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