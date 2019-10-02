
import { isArray, objectMap, isSameClass, objectValues, isFunction } from './fns';
import { Type, TypeClass, TypeParser, TypeInput, TypeInputMap, TypeMap } from './Type';
import { Expression, ExpressionClass, ExpressionMap } from './Expression';
import { Operations, OperationTypes, OperationTypeInput, OperationGeneric, OperationPair } from './Operation';
import { ConstantExpression } from './exprs/Constant';
import { AnyType } from './types/Any';
import { OptionalType } from './types/Optional';
import { ManyType } from './types/Many';
import { FunctionType } from './types/Function';
import { ObjectType } from './types/Object';



export interface DefinitionsImportOptions
{
  aliases?: Record<string, Type | any>;
  functions?: Record<string, FunctionType | any>;
}

export interface DefinitionsOptions extends DefinitionsImportOptions
{
  types?: TypeClass[];
  expressions?: ExpressionClass[];
}

export class Definitions 
{

  public types: Record<string, TypeClass>;
  public describers: TypeClass[];
  public parsers: Record<string, TypeParser>;
  public expressions: Record<string, ExpressionClass>;
  public operations: Operations;
  public aliased: TypeMap;
  public functions: Record<string, FunctionType>;

  public constructor(initial?: DefinitionsOptions)
  { 
    this.types = Object.create(null);
    this.expressions = Object.create(null);
    this.parsers = Object.create(null);
    this.functions = Object.create(null);
    this.describers = [];
    this.operations = new Operations('');

    if (initial) 
    {
      this.add(initial);
    }
  }

  public extend(deepCopy: boolean = false, initial?: DefinitionsOptions): Definitions
  { 
    const copy = new Definitions({
      types: objectValues(this.types),
      expressions: objectValues(this.expressions),
      aliases: objectMap(this.aliased, a => deepCopy ? a.encode() : a),
      functions: objectMap(this.functions, f => deepCopy ? f.encode() : f)
    });

    if (initial)
    {
      copy.add(initial);
    }

    return copy;
  }

  public add(options: DefinitionsOptions)
  {
    if (options.types) 
    {
      options.types.forEach(type => this.addType(type, true));
    }

    this.sortDescribers();

    if (options.expressions) 
    {
      options.expressions.forEach(expr => this.addExpression(expr));
    }

    this.import(options);
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

  public mergeTypes(readonlyTypes: Type[]): Type | null
  {
    if (readonlyTypes.length === 0)
    {
      return null;
    }

    if (readonlyTypes.find(t => t instanceof AnyType))
    {
      return AnyType.baseType;
    }

    const cloned = readonlyTypes.map(t => t.clone());

    return cloned.reduce((a, b) => this.mergeType(a, b));
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

  public optionalType(type: Type): OptionalType
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

  public addType<T extends Type>(type: TypeClass<T>, delaySort: boolean = false) 
  {
    this.types[type.id] = type;
    this.parsers[type.id] = (data, types) => type.decode(data, types);
    this.describers.push(type);

    if (!delaySort)
    {
      this.sortDescribers();
    }
  }

  public addAlias<T extends Type>(alias: string, instance: T | any) 
  {
    const type = instance instanceof Type
      ? instance
      : this.getType(instance);

    this.parsers[alias] = () => type;
    this.aliased[alias] = type;
  }

  public getType(value: any): Type 
  {
    if (value instanceof Type)
    {
      return value;
    }

    const id = isArray(value) ? value[0] : value;
    const data = isArray(value) ? value : [];

    return this.parsers[id](data, this);
  }

  public addFunction(name: string, returnType: TypeInput, params: TypeInputMap, expr: any): FunctionType
  {
    const func = new FunctionType({
      returnType: Type.resolve(returnType),
      params: ObjectType.from(Type.resolve(params)),
      expression: this.getExpression(expr)
    });

    this.functions[name] = func;

    return func;
  }

  public setFunction(name: string, typeValue: any): FunctionType
  {
    return this.functions[name] = this.getType(typeValue) as FunctionType;
  }

  public getFunction(name: string): FunctionType
  {
    return this.functions[name];
  }

  public getOperation(id: string): OperationGeneric | null
  {
    const op = this.operations.get(id);

    if (op)
    {
      return op;
    }

    const [typeName] = id.split(':');
    const type = this.types[typeName];

    return type ? type.operations.get(id) : null;
  }

  public getOperationTypes(id: string): OperationTypes<any, any, any> | null
  {
    const op = this.operations.getTypes(id);

    if (op)
    {
      return op;
    }

    const [typeName] = id.split(':');
    const type = this.types[typeName];

    return type ? type.operations.getTypes(id) : null;
  }

  public getOperationReturnType(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type): Type | null
  {
    const op = this.getOperation(id);
    const types = this.getOperationTypes(id);
    const returnType = types.returnType;

    if (returnType instanceof Type)
    {
      return returnType;
    }

    if (!isFunction(returnType))
    {
      return returnType.baseType.newInstance();
    }

    const paramTypes = op.resultDependency.length > 0
      ? this.getOperationParamTypes(id, params, scopeAlias, context)
      : {};

    return this.getOperationInputType(types.returnType, paramTypes);
  }

  public getOperationParamTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type): TypeMap
  {
    const types: TypeMap = {};
    const op = this.getOperation(id);
    const opTypes = this.getOperationTypes(id);
    
    for (const param in params)
    {
      if (op.hasScope.indexOf(param) === -1)
      {
        const paramType = params[param].getType(this, context);

        if (paramType)
        {
          types[param] = paramType.getSimplifiedType();
        }
      }
    }

    const { context: paramContext, scope: scopeTarget } = this.getContextWithScope(context);
    
    for (const scopeParam of op.scope)
    {
      const scopeType = this.getOperationInputType(opTypes.scope[scopeParam], types);

      if (scopeType)
      {
        const alias = scopeAlias[scopeParam] || scopeParam;

        scopeTarget[alias] = scopeType.getSimplifiedType();
      }
    }

    for (const param in params)
    {
      if (op.hasScope.indexOf(param) !== -1)
      {
        const paramType = params[param].getType(this, paramContext);

        if (paramType)
        {
          types[param] = paramType.getSimplifiedType();
        }
      }
    }

    return types;
  }

  public getContextWithScope(original: Type, scope: TypeMap = {})
  {
    const context = original instanceof ObjectType
      ? new ObjectType({ props: scope = { ...original.options.props, ...scope }})
      : new ManyType([ original, new ObjectType({ props: scope })]);

    return { context, scope };
  }

  public getContext(original: Type, scope: TypeMap)
  {
    return this.getContextWithScope(original, scope).context;
  }

  public getOperationInputType(input: OperationTypeInput<any>, params: TypeMap): Type
  {
    return input instanceof Type
      ? input
      : 'baseType' in input
        ? input.baseType.clone()
        : Type.fromInput(input(params));
  }

  public getOperationsForExpression(expr: Expression, context: Type): OperationPair[]
  {
    const type = expr.getType(this, context);

    return type ? this.getOperationsForType(type.getSimplifiedType()) : [];
  }

  public getOperationsForType(type: Type): OperationPair[]
  {
    return this.getOperations(({ op, types }) => 
    {
      const opTypeInput = types.params[op.params[0]];

      if (opTypeInput) 
      {
        const opType = this.getOperationInputType(opTypeInput, {});

        if (opType && type.isCompatible(opType)) 
        {
          return true;
        }
      }

      return false;
    });
  }

  public getOperationsWithReturnExpression(expr: Expression, context: Type, paramTypes: TypeMap = {}): OperationPair[]
  {
    const type = expr.getType(this, context);

    return type ? this.getOperationsWithReturnType(type.getSimplifiedType(), paramTypes) : [];
  }

  public getOperationsWithReturnType(type: Type, paramTypes: TypeMap = {}): OperationPair[]
  {
    return this.getOperations(({ types }) =>
    {
      const returnType = this.getOperationInputType(types.returnType, paramTypes);

      if (returnType && type.isCompatible(returnType))
      {
        return true;
      }

      return false;
    });
  }

  public getOperationsForParamExpressions(params: ExpressionMap, context: Type): OperationPair[]
  {
    return this.getOperationsForParamTypes(objectMap(params, expr => 
    {
      const type = expr.getType(this, context);

      return type ? type.getSimplifiedType() : undefined;
    }));
  }

  public getOperationsForParamTypes(paramTypes: TypeMap): OperationPair[]
  {
    const paramNames = Object.keys(paramTypes);

    return this.getOperations(({ types }) => 
    {
      for (const param of paramNames)
      {
        const opTypeInput = types.params[param] || types.optional[param];

        if (!opTypeInput)
        {
          return false;
        }

        const opType = this.getOperationInputType(opTypeInput, paramTypes);

        if (!opType || !paramTypes[param].isCompatible(opType))
        {
          return false;
        }
      }

      return true;
    });
  }

  public getOperations(onOperation: <P extends string, O extends string, S extends string>(pair: OperationPair<P, O, S>) => boolean = () => true): OperationPair[]
  {
    const ops: OperationPair[] = [];

    const iterateOperations = (operations: Operations) => 
    {
      const map = operations.map;

      for (const id in map)
      {
        const op = map[id];
        const types = operations.types[id];
        const pair = { op, types };

        if (onOperation(pair))
        {
          ops.push(pair);
        }
      }
    };

    iterateOperations(this.operations);

    objectMap(this.types, t => iterateOperations(t.operations));

    return ops;
  }

  public getPathType(path: Expression[], context: Type, stopBefore: number = path.length): Type | null
  {
    let node = context;

    for (let i = 0; i < stopBefore; i++)
    {
      node = node.getSubType(path[i], this, context);

      if (!node)
      {
        return null;
      }
    }

    return node;
  }

  public addExpression<T extends Expression>(expr: ExpressionClass<T>) 
  {
    this.expressions[expr.id] = expr;
  }

  public getExpression(value: any): Expression 
  {
    if (value instanceof Expression)
    {
      return value;
    }
    else if (isArray(value))
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

  public export(): DefinitionsImportOptions
  {
    return {
      aliases: objectMap(this.aliased, a => a.encode()),
      functions: objectMap(this.functions, f => f.encode())
    };
  }

  public import(exported: DefinitionsImportOptions): void
  {
    if (exported.aliases) 
    {
      objectMap(exported.aliases, (instance, alias) => 
        this.addAlias(alias, instance)
      );
    }

    if (exported.functions)
    {
      objectMap(exported.functions, (func, name) => 
        this.setFunction(name, func)
      );
    }
  }

}