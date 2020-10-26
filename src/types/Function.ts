
import { Type, TypeSub, TypeCompatibleOptions, TypeDescribeProvider, TypeMap, TypeProvider, TypeChild } from '../Type';
import { Operations } from '../Operation';
import { Exprs } from '../Exprs';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { ID } from './ID';
import { Traverser, TraverseStep } from '../Traverser';
import { Computeds } from '../Computed';
import { isFunction, objectMap, objectEach } from '../fns';
import { DataTypes } from '../DataTypes';
import { GenericType } from './Generic';


const INDEX_PROPS = 1;
const INDEX_RETURN = 2;

export type FunctionTypeProvider = Type | ((params: TypeMap) => Type);

export interface FunctionOptions
{
  params: Record<string, FunctionTypeProvider>;
  returns?: FunctionTypeProvider;
}

export class FunctionType extends Type<FunctionOptions> 
{

  public static STEP_RETURNS = 'returns';

  public static CHILD_RETURN = 'returns';

  public static id = ID.Function;

  public static operations = new Operations(ID.Function + ID.Delimiter);

  public static computeds = new Computeds(ID.Function + ID.Delimiter);

  public static baseType = new FunctionType({ params: {} });

  public static decode(data: any[], types: TypeProvider): FunctionType 
  {
    const params = objectMap(data[INDEX_PROPS], (p) => types.getType(p));
    const returns = data[INDEX_RETURN]
      ? types.getType(data[INDEX_RETURN])
      : undefined;
    
    return new FunctionType({ params, returns });
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
  
  public static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | null
  {
    return null;
  }

  public static registered: boolean = false;

  public static register(): void
  {

  }

  public getParamTypes(inputTypes: TypeMap = {}): TypeMap
  {
    const { params } = this.options;
    const out: TypeMap = {
      ...inputTypes,
    };

    for (const paramName in params)
    {
      const paramType = params[paramName];
      const inputType = inputTypes[paramName];

      if (isFunction(paramType))
      {
        out[paramName] = paramType(out);
      }
      else if (!inputType || !paramType.acceptsType(inputType))
      {
        out[paramName] = paramType;
      }
    }

    return out;
  }

  public getReturnType(inputTypes: TypeMap = {}): Type
  {
    const { returns } = this.options;

    return returns instanceof Type
      ? returns
      : returns(inputTypes);
  }

  public getTypeFromPath(path: TypeChild[], inputTypes: TypeMap = {}): Type | null
  {
    let last: Type = inputTypes[path[0]] instanceof Type
      ? inputTypes[path[0]]
      : this.getChildType(path[0]);

    for (let i = 1; i < path.length; i++)
    {
      last = last?.getChildType(path[i]);
    }

    return last || null;
  }

  public getOverloaded(inputTypes: TypeMap = {}): FunctionType
  {
    const overloaded = this.clone();

    overloaded.traverse(new Traverser((type, typePath, typeParent, traverser) => 
    {
      if (type instanceof GenericType)
      {
        while (type && type instanceof GenericType)
        {
          const resolved = overloaded.getResolvedType(type, inputTypes);

          if (resolved === type)
          {
            break;
          }
          else
          {
            type = resolved;
          }
        }

        if (type)
        {
          traverser.replace(type);
        }
      }
    }));

    return overloaded;
  }

  public getResolvedType(type: GenericType, inputTypes: TypeMap = {}): Type
  {
    const { path, base } = type.options;

    let resolved = this.getTypeFromPath(path, inputTypes);

    if (resolved === type)
    {
      return base;
    }

    let func: FunctionType = this;

    while (!resolved)
    {
      func = func.getParentOfType(FunctionType);

      if (!func)
      {
        break;
      }

      resolved = func.getTypeFromPath(path, inputTypes);
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

  public getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null
  {
    return null;
  }

  public getSubTypes(def: DefinitionProvider): TypeSub[]
  {
    return [];
  }

  public getChildType(name: TypeChild): Type | null
  {
    const { returns } = this.options;
    const params = this.getParamTypes();

    if (name === FunctionType.CHILD_RETURN)
    {
      return isFunction(returns)
        ? returns(params)
        : returns;
    }

    return params[name] || null;
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

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    const { params, returns } = this.options;

    return traverse.enter(this, () => 
    {
      objectEach(params, (type, paramName) => 
      {
        const paramType = isFunction(type)
          ? type({})
          : type;
        
        traverse.step(paramName, paramType, (replaceWith) => DataTypes.objectSet(params, paramName, replaceWith), () => DataTypes.objectRemove(params, paramName))
      });

      const returnType = isFunction(returns)
        ? returns({})
        : returns;
      
      traverse.step(FunctionType.STEP_RETURNS, returnType, (replaceWith) => DataTypes.objectSet(this.options, 'returns', replaceWith), () => DataTypes.objectRemove(this.options, 'returns'));
    });
  }

  public getTypeFromStep(step: TraverseStep): Type | null
  {
    const { params, returns } = this.options;
    const param = params[step];

    return step === FunctionType.STEP_RETURNS
      ? returns instanceof Type
        ? returns
        : null
      : param instanceof Type
        ? param
        : null;
  }

  public setParent(parent: Type = null): void
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

  public isValid(value: any): boolean 
  {
    return isFunction(value);
  }

  public normalize(value: any): any
  {
    return value;
  }

  public newInstance(): FunctionType
  {
    return new FunctionType({ params: {} });
  }

  public clone(): FunctionType
  {
    // TODO
    return this;
  }

  public encode(): any 
  {
    return FunctionType.encode(this);
  }

  public create(): null
  {
    return null;
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return null;
  }

  public fromJson(json: null): null
  {
    return null;
  }

  public toJson(value: null): null
  {
    return null;
  }

}
