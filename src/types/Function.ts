
import { Type, TypeSub, TypeCompatibleOptions, TypeDescribeProvider, TypeMap, TypeProvider, TypeChild, TypeMapFor } from '../Type';
import { Operations } from '../Operation';
import { Exprs } from '../Exprs';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { ID } from './ID';
import { Traverser, TraverseStep } from '../Traverser';
import { Computeds } from '../Computed';
import { isFunction, objectMap, objectEach, isString } from '../fns';
import { DataTypes } from '../DataTypes';
import { GenericType } from './Generic';
import { FunctionExpression } from '../exprs/Function';
import { ObjectType } from './Object';


const INDEX_PROPS = 1;
const INDEX_RETURN = 2;

export type FunctionParams = Record<string, any>;

export type FunctionTypeProvider<T, P extends FunctionParams> = Type<T> | ((params: Partial<TypeMapFor<P>>, types: TypeProvider) => Type<T>);

export interface FunctionOptions<P extends FunctionParams = any, R = any>
{
  params: {
    [K in keyof P]: FunctionTypeProvider<P[K], P>
  };
  returns?: FunctionTypeProvider<R, P>;
}

export type FunctionInterface<P extends FunctionParams = any, R = any> = (params: P) => R;

export type FunctionValue<P extends FunctionParams = any, R = any> = 
  FunctionExpression |
  FunctionInterface<P, R> |
  string;

export class FunctionType<P extends FunctionParams = any, R = any> extends Type<FunctionValue<P, R>, FunctionOptions<P, R>> 
{

  public static STEP_RETURNS = 'returns';

  public static CHILD_RETURN = 'returns';

  public static id = ID.Function;

  public static operations = new Operations(ID.Function + ID.Delimiter);

  public static computeds = new Computeds(ID.Function + ID.Delimiter);

  public static baseType = new FunctionType({ params: {} }, null as any);

  public static decode(data: any[], types: TypeProvider): FunctionType 
  {
    const params = objectMap(data[INDEX_PROPS], (p) => types.getType(p));
    const returns = data[INDEX_RETURN]
      ? types.getType(data[INDEX_RETURN])
      : undefined;
    
    return new FunctionType({ params, returns }, types);
  }

  public static encode(type: FunctionType): any 
  {
    const { params, returns } = type.options;

    const paramsData = objectMap(params, p => p instanceof Type ? p.encode() : undefined);

    return returns instanceof Type
      ? [this.id, paramsData, returns.encode()]
      : [this.id, paramsData];
  }

  public static describePriority: number = 6;
  
  public static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | undefined
  {
    return undefined;
  }

  public static registered: boolean = false;

  public static register(): void
  {

  }

  public provider: TypeProvider;

  public constructor(options: FunctionOptions<P, R>, provider: TypeProvider)
  {
    super(options);

    this.provider = provider;
  }

  public getParamTypesType(inputTypes: Partial<TypeMapFor<P>> = {}): ObjectType<P>
  {
    return new ObjectType({ props: this.getParamTypes(inputTypes) });
  }

  public getParamTypes(inputTypes: Partial<TypeMapFor<P>> = {}): TypeMapFor<P>
  {
    const { params } = this.options;
    const out: TypeMapFor<P> = Object.create(null);

    Object.assign(out, inputTypes);

    for (const paramName in params)
    {
      const inputType = inputTypes[paramName];
      const paramType = this.getProvided(params[paramName], out as Partial<TypeMapFor<P>>);

      if (!inputType || !paramType.acceptsType(inputType as Type))
      {
        out[paramName] = paramType;
      }
    }

    return out;
  }

  public getParamType<K extends keyof P>(param: K, inputTypes: Partial<TypeMapFor<P>> = {}): Type<P[K]> | undefined
  {
    return this.getProvided(this.options.params[param], inputTypes);
  }

  public getReturnType(inputTypes: Partial<TypeMapFor<P>> = {}): Type<R> | undefined
  {
    return this.getProvided(this.options.returns, inputTypes);
  }

  public getProvided<T>(provider: FunctionTypeProvider<T, P>, inputTypes?: Partial<TypeMapFor<P>>): Type<T>
  public getProvided<T>(provider: FunctionTypeProvider<T, P> | undefined, inputTypes?: Partial<TypeMapFor<P>>): Type<T> | undefined
  public getProvided<T>(provider: FunctionTypeProvider<T, P> | undefined, inputTypes: Partial<TypeMapFor<P>> = {}): Type<T> | undefined
  {
    return provider instanceof Type
      ? provider
      : typeof provider === 'function' 
        ? provider(inputTypes, this.provider)
        : undefined;
  }

  public getTypeFromPath(path: TypeChild[], inputTypes: TypeMap = {}): Type | undefined
  {
    let last: Type | undefined = inputTypes[path[0]] instanceof Type
      ? inputTypes[path[0]]
      : this.getChildType(path[0]);

    for (let i = 1; i < path.length; i++)
    {
      last = last?.getChildType(path[i]);
    }

    return last;
  }

  public getOverloaded(inputTypes: TypeMap = {}): FunctionType
  {
    const overloaded = this.clone();

    overloaded.traverse(new Traverser((type, typePath, typeParent, traverser) => 
    {
      let currentType: Type | undefined = type;

      if (currentType instanceof GenericType)
      {
        while (currentType && currentType instanceof GenericType)
        {
          const resolved = overloaded.getResolvedType(currentType, inputTypes);

          if (resolved === currentType)
          {
            break;
          }
          else
          {
            currentType = resolved;
          }
        }

        if (currentType)
        {
          traverser.replace(currentType);
        }
      }
    }, undefined));

    return overloaded;
  }

  public getResolvedType(type: GenericType, inputTypes: Partial<TypeMapFor<P>> = {}): Type | undefined
  {
    const { path, base } = type.options;

    let resolved = this.getTypeFromPath(path, inputTypes as TypeMap);

    if (resolved === type)
    {
      return base;
    }

    let func: FunctionType | undefined = this;

    while (!resolved)
    {
      func = func.getParentOfType(FunctionType);

      if (!func)
      {
        break;
      }

      resolved = func.getTypeFromPath(path, inputTypes as TypeMap);
    }

    return resolved || base;
  }

  public getId(): string
  {
    return FunctionType.id;
  }

  public getOperations()
  {
    return {};
  }

  public merge(type: FunctionType): void
  {
    
  }

  public getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | undefined
  {
    return undefined;
  }

  public getSubTypes(def: DefinitionProvider): TypeSub[]
  {
    return [];
  }

  public getChildType(name: TypeChild): Type | undefined
  {
    const params = this.getParamTypes();

    if (name === FunctionType.CHILD_RETURN)
    {
      return this.getReturnType(params as Partial<TypeMapFor<P>>);
    }

    return params[name];
  }

  public getChildTypes(): TypeChild[]
  {
    const { params } = this.options;

    return Object.keys(params).concat(FunctionType.CHILD_RETURN);
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public getSimplifiedType(): Type
  {
    return this;
  }

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean 
  {
    if (!(other instanceof FunctionType))
    {
      return false;
    }

    const otherParams = other.getParamTypes();
    const resolved = this.getOverloaded(otherParams);
    const resolvedOther = other.getOverloaded();
    const { params, returns } = resolved.options;
    const { params: paramsOther, returns: returnsOther } = resolvedOther.options;

    if (Boolean(returns) !== Boolean(returnsOther))
    {
      return false;
    }

    if (!(returns as Type).isCompatible(returnsOther as Type, options))
    {
      return false; 
    }
    
    for (const paramName in params)
    {
      if (!params[paramName])
      {
        continue;
      }

      if (!(paramName in paramsOther) && (options.exact || !(params[paramName] as Type).isOptional()))
      {
        return false;
      }

      const paramType = params[paramName];
      const paramTypeOther = paramsOther[paramName];

      if (!(paramType as Type).isCompatible(paramTypeOther as Type, options))
      {
        return false;
      }
    }

    for (const paramNameOther in paramsOther)
    {
      if (!paramsOther[paramNameOther])
      {
        continue;
      }
      
      if (!params[paramNameOther] && (options.exact || !(paramsOther[paramNameOther] as Type).isOptional()))
      {
        return false;
      }
    }
    
    return true;
  }

  public isOptional(): boolean
  {
    return false;
  }

  public isSimple(): boolean
  {
    return false;
  }

  public traverse<A>(traverse: Traverser<Type, A>): A
  {
    const { params } = this.options;

    return traverse.enter(this, () => 
    {
      objectEach(params, (type, paramName) => 
      {
        const paramType = this.getProvided(type);
        
        if (paramType)
        {
          traverse.step(paramName as string, paramType, (replaceWith) => DataTypes.objectSet(params, paramName, replaceWith), () => DataTypes.objectRemove(params, paramName))
        }
      });

      const returnType = this.getReturnType();

      if (returnType)
      {
        traverse.step(FunctionType.STEP_RETURNS, returnType, (replaceWith) => DataTypes.objectSet(this.options, 'returns', replaceWith), () => DataTypes.objectRemove(this.options, 'returns'));
      }
    });
  }

  public getTypeFromStep(step: TraverseStep): Type | undefined
  {
    const { params, returns } = this.options;
    const param = params[step];

    return step === FunctionType.STEP_RETURNS
      ? returns instanceof Type
        ? returns
        : undefined
      : param instanceof Type
        ? param
        : undefined;
  }

  public setParent(parent?: Type): void
  {
    this.parent = parent;

    const { params, returns } = this.options;

    for (const paramName in params)
    {
      const paramValue = params[paramName];

      if (paramValue instanceof Type)
      {
        paramValue.setParent(this);
      }
    }

    if (returns && returns instanceof Type)
    {
      returns.setParent(this);
    }
  }

  public removeDescribedRestrictions(): void
  {
    const { params, returns } = this.options;

    for (const paramName in params)
    {
      const paramValue = params[paramName];

      if (paramValue instanceof Type)
      {
        paramValue.removeDescribedRestrictions();
      }
    }

    if (returns && returns instanceof Type)
    {
      returns.removeDescribedRestrictions();
    }
  }

  public getCreateExpression(): Expression
  {
    return Exprs.null();
  }

  public getValidateExpression(): Expression
  {
    return Exprs.null();
  }

  public getCompareExpression(): Expression
  {
    return Exprs.null();
  }

  public isValid(value: any): value is FunctionValue<P, R>
  {
    return isFunction(value) || 
      isString(value) || 
      this.provider.isExpression(value);
  }

  public normalize(value: any): any
  {
    return this.provider.isExpression(value)
      ? this.provider.getExpression(value)
      : value;
  }

  public newInstance(): FunctionType
  {
    return new FunctionType({ params: {} }, this.provider);
  }

  public clone(): FunctionType
  {
    return new FunctionType({
      params: objectMap(this.options.params, 
        (p) => p instanceof Type ? p.clone(): p
      ),
      returns: this.options.returns instanceof Type 
        ? this.options.returns.clone() 
        : this.options.returns,
    }, this.provider);
  }

  public encode(): any 
  {
    return FunctionType.encode(this);
  }

  public create(): FunctionValue
  {
    return '';
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return null;
  }

  public fromJsonArguments(json: any): any
  {
    const { params } = this.options;
    const args: any = {};

    for (const paramName in params) {
      const paramType = params[paramName];

      if (paramType instanceof Type && paramName in json) {
        args[paramName] = paramType.fromJson(json[paramName]);
      }
    }

    return args;
  }

  public toJsonArguments(args: any): any
  {
    const { params } = this.options;
    const json: any = {};

    for (const paramName in params) {
      const paramType = params[paramName];

      if (paramType instanceof Type && paramName in args) {
        json[paramName] = paramType.fromJson(args[paramName]);
      }
    }

    return json;
  }

  public fromJson(json: any): FunctionValue<P, R>
  {
    return this.provider.isExpression(json)
      ? this.provider.getExpression(json)
      : json;
  }

  public toJson(value: FunctionValue<P, R>): any
  {
    return value instanceof Expression
      ? value.encode()
      : value;
  }

}
