
import { objectMap, isObject, objectValues, isString, toArray, objectEach, addCopier } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider, TypeInputMap, TypeMap, TypeSub, TypeCompatibleOptions } from '../Type';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { ObjectOps, ObjectOperations, ObjectComputeds } from '../ops/ObjectOps';
import { Definitions } from '../Definitions';
import { ConstantExpression } from '../exprs/Constant';
import { EnumType } from './Enum';
import { TextType } from './Text';
import { ID } from './ID';
import { Traverser } from '../Traverser';
import { AnyType } from './Any';


const INDEX_PROPS = 1;

export interface ObjectOptions 
{
  props: TypeMap;
}

export class ObjectType<O extends ObjectOptions = ObjectOptions> extends Type<O> 
{

  public static wilcardProperty = '*';

  public static propType = new TextType({});

  public static id = ID.Object;

  public static operations = ObjectOperations;

  public static computeds = ObjectComputeds;

  public static baseType = ObjectType.from();

  public static decode(data: any[], types: TypeProvider): ObjectType 
  {
    const props = objectMap(data[INDEX_PROPS], value => types.getType(value));
    
    return ObjectType.from(props);
  }

  public static encode(type: ObjectType): any 
  {
    const props = objectMap(type.options.props, p => p.encode());

    return [this.id, props];
  }

  public static describePriority: number = 5;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    if (!isObject(data) || data === null)
    {
      return null;
    }

    return ObjectType.from(objectMap(data, d => describer.describe(d)));
  }

  public static from(types?: TypeInputMap): ObjectType
  {
    return new ObjectType({
      props: types ? Type.resolve(types) : {}
    });
  }

  public static registered: boolean = false;

  public static register(): void
  {
    const ANY_TYPE_PRIORITY = 7;

    AnyType.addJsonReader(ANY_TYPE_PRIORITY, (json, reader) => {
      if (isObject(json)) {
        return objectMap(json, (prop) => reader(prop));
      }
    });

    AnyType.addJsonWriter(ANY_TYPE_PRIORITY, (json, writer) => {
      if (isObject(json)) {
        return objectMap(json, (prop) => writer(prop));
      }
    });

    addCopier(ANY_TYPE_PRIORITY, (x, copyAny, copied) => {
      if (isObject(x)) {
        const newObject: any = {};
        copied.set(x, newObject);

        for (const prop in x) {
          newObject[copyAny(prop, copied)] = copyAny(x[prop], copied);
        }

        return newObject;
      }
    });
  }

  public getId(): string
  {
    return ObjectType.id;
  }

  public getOperations()
  {
    return ObjectType.operations.map;
  }

  public merge(type: Type<O>, describer: TypeDescribeProvider): void
  {
    const p1 = this.options.props;
    const p2 = type.options.props;

    for (const prop in p1)
    {
      if (prop in p2)
      {
        p1[prop] = describer.mergeType(p1[prop], p2[prop]);
      }
      else
      {
        p1[prop] = describer.optionalType(p1[prop]);
      }
    }

    for (const prop in p2)
    {
      if (!(prop in p1))
      {
        p1[prop] = describer.optionalType(p2[prop]);
      }
    }
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    if (ConstantExpression.is(expr))
    {
      if (isString(expr.value))
      {
        return this.options.props[expr.value];
      }
    }

    const exprType = def.requiredType(expr.getType(def, context));

    if (exprType)
    {
      if (exprType instanceof TextType)
      {
        const types = objectValues(this.options.props);

        return def.mergeTypes(types);
      }

      if (exprType instanceof EnumType)
      {
        const values = toArray(exprType.options.constants.values());
        const types = values.map(p => this.options.props[p]).filter(t => !!t);

        return def.mergeTypes(types);
      }
    }

    return this.getWildcardType();
  }

  public getSubTypes(def: Definitions): TypeSub[]
  {
    return [
      ...objectValues(this.options.props, (value, key) => ({ key, value })),
      {
        key: new EnumType({
          key: TextType.baseType,
          value: TextType.baseType,
          constants: new Map(
            objectValues(this.options.props, (prop, key) => [key, key]),
          ),
        }),
        value: def.mergeTypes(
          objectValues(this.options.props)
        ),
      },
      { 
        key: ObjectType.propType, 
        value: def.optionalType(
          def.mergeTypes(
            objectValues(this.options.props)
          )
        ),
      }
    ];
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public getSimplifiedType(): Type 
  {
    return this;
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this, () => 
      objectEach(this.options.props, 
        (type, prop) => traverse.step(prop, type)
      )
    );
  }

  public setParent(parent: Type = null): void
  {
    this.parent = parent;

    objectEach(this.options.props, t => t.setParent(this));
  }

  public removeDescribedRestrictions(): void
  {
    objectEach(this.options.props, t => t.removeDescribedRestrictions());
  }

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean 
  {
    if (!(other instanceof ObjectType)) 
    {
      return false;
    }

    const props = this.options.props;

    for (const prop in props) 
    {
      if (prop === ObjectType.wilcardProperty)
      {
        continue;
      }

      if (!other.options.props[prop]) 
      {
        return false;
      }

      if (!props[prop].isCompatible(other.options.props[prop], options))
      {
        return false;
      }
    }

    const wildcard = this.getWildcardType();

    if (options.exact)
    {
      for (const prop in other.options.props)
      {
        if (!props[prop])
        {
          return false;
        }
      }
    }
    else if (wildcard)
    {
      for (const prop in other.options.props)
      {
        if (!props[prop] && !wildcard.isCompatible(other.options.props[prop], options))
        {
          return false;
        }
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

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.object(
      objectMap(this.options.props, (t) => t.getCreateExpression(ex))
    );
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.and(
      ex.op(ObjectOps.isValid, {
        value: ex.get('value'),
      }),
      ...objectValues(this.options.props, (t, prop) =>
        ex.define({ 
          value: ex.get('value', prop) 
        }).run(
          t.getValidateExpression(ex),
        ),
      ),
    );
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return ex.or(
      ...objectValues(this.options.props, (t, prop) =>
        ex.define({ 
          value: ex.get('value', prop),
          test: ex.get('test', prop) 
        }).run(
          t.getCompareExpression(ex),
        ),
      ),
    );
  }

  public isValid(value: any): boolean 
  {
    if (!isObject(value)) 
    {
      return false;
    }

    const props = this.options.props;

    for (const prop in props) 
    {
      if (prop === ObjectType.wilcardProperty)
      {
        continue;
      }

      if (!props[prop].isValid(value[prop])) 
      {
        return false;
      }
    }

    const wildcard = this.getWildcardType();

    if (wildcard)
    {
      for (const prop in value)
      {
        if (!props[prop] && !wildcard.isValid(value[prop]))
        {
          return false;
        }
      }
    }

    return true;
  }

  public normalize(value: any): any
  {
    return value;
  }

  public newInstance(): ObjectType<O>
  {
    return new ObjectType({ props: {} } as O);
  }

  public clone(): ObjectType<O>
  {
    return new ObjectType<O>({
      props: objectMap(this.options.props, p => p.clone()),
    } as O);
  }

  public encode(): any 
  {
    return ObjectType.encode(this);
  }

  public create(): any
  {
    return Object.create(null);
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const { props } = this.options;
    const out: any = Object.create(null);

    for (const prop in props)
    {
      out[prop] = props[prop].random(rnd);
    }

    return out;
  }

  public fromJson(json: any): any
  {
    return objectMap(json, (value, key) => {
      const propType = this.options.props[key];

      return propType ? propType.fromJson(value) : value;
    });
  }

  public toJson(value: any): any
  {
    return objectMap(value, (subvalue, key) => {
      const propType = this.options.props[key];
      
      return propType ? propType.toJson(subvalue) : subvalue;
    });
  }

  public getWildcardType(): Type | null
  {
    return this.options.props[ObjectType.wilcardProperty] || null;
  }

}