
import { objectMap, isObject, objectValues, isString, objectEach, addCopier } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider, TypeMap, TypeSub, TypeCompatibleOptions } from '../Type';
import { Exprs } from '../Exprs';
import { Expression } from '../Expression';
import { ObjectOps, ObjectOperations, ObjectComputeds } from '../ops/ObjectOps';
import { DefinitionProvider } from '../DefinitionProvider';
import { ConstantExpression } from '../exprs/Constant';
import { EnumType } from './Enum';
import { TextType } from './Text';
import { ID } from './ID';
import { Traverser, TraverseStep } from '../Traverser';
import { AnyType } from './Any';
import { Types } from '../Types';


const INDEX_PROPS = 1;

export interface ObjectOptions 
{
  props: TypeMap;
}

export class ObjectType<O extends ObjectOptions = ObjectOptions> extends Type<O> 
{

  public static wilcardProperty = '*';

  public static id = ID.Object;

  public static operations = ObjectOperations;

  public static computeds = ObjectComputeds;

  public static baseType = new ObjectType({ props: {} });

  public static decode(data: any[], types: TypeProvider): ObjectType 
  {
    const props = objectMap(data[INDEX_PROPS], value => types.getType(value));
    
    return new ObjectType({ props });
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

    return new ObjectType({
      props: objectMap(data, d => describer.describe(d))
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

  public merge(type: Type<O>): void
  {
    const p1 = this.options.props;
    const p2 = type.options.props;

    for (const prop in p1)
    {
      if (prop in p2 && p2[prop])
      {
        p1[prop] = Types.merge(p1[prop], p2[prop]);
      }
      else if (p1[prop])
      {
        p1[prop] = Types.optional(p1[prop]);
      }
    }

    for (const prop in p2)
    {
      if (!(prop in p1) && p2[prop])
      {
        p1[prop] = Types.optional(p2[prop]);
      }
    }
  }

  public getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null
  {
    if (ConstantExpression.is(expr))
    {
      if (isString(expr.value))
      {
        return this.options.props[expr.value];
      }
    }

    let exprType = expr.getType(def, context);

    if (exprType)
    {
      exprType = exprType.getRequired();

      if (exprType instanceof TextType)
      {
        const types = objectValues(this.options.props);

        return Types.mergeMany(types);
      }

      if (exprType instanceof EnumType)
      {
        const values = Array.from(exprType.options.constants.values());
        const types = values.map((p) => this.options.props[p]).filter(t => !!t);

        return Types.mergeMany(types);
      }
    }

    return this.getWildcardType();
  }

  public getSubTypes(def: DefinitionProvider): TypeSub[]
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
        value: Types.mergeMany(
          objectValues(this.options.props)
        ),
      },
      { 
        key: TextType.baseType, 
        value: Types.optional(
          Types.mergeMany(
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
        (type, prop) => traverse.step(prop, type, (replaceWith) => this.options.props[prop] = replaceWith, () => delete this.options.props[prop])
      )
    );
  }

  public getTypeFromStep(step: TraverseStep): Type | null
  {
    return this.options.props[step] || null;
  }

  public setParent(parent: Type = null): void
  {
    this.parent = parent;

    objectEach(this.options.props, t => t ? t.setParent(this) : 0);
  }

  public removeDescribedRestrictions(): void
  {
    objectEach(this.options.props, t => t ? t.removeDescribedRestrictions() : 0);
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

      if (!props[prop])
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
        if (!props[prop] && other.options.props[prop])
        {
          return false;
        }
      }
    }
    else if (wildcard)
    {
      for (const prop in other.options.props)
      {
        if (!props[prop] && other.options.props[prop] && !wildcard.isCompatible(other.options.props[prop], options))
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

  public getCreateExpression(): Expression
  {
    return Exprs.object(
      objectMap(this.options.props, (t) => t ? t.getCreateExpression() : Exprs.noop())
    );
  }

  public getValidateExpression(): Expression
  {
    return Exprs.and(
      Exprs.op(ObjectOps.isValid, {
        value: Exprs.get('value'),
      }),
      ...objectValues(this.options.props, (t, prop) =>
        Exprs.define({ 
          value: Exprs.get('value', prop) 
        }).run(
          t ? t.getValidateExpression() : Exprs.true(),
        ),
      ),
    );
  }

  public getCompareExpression(): Expression
  {
    return Exprs.or(
      ...objectValues(this.options.props, (t, prop) =>
        Exprs.define({ 
          value: Exprs.get('value', prop),
          test: Exprs.get('test', prop) 
        }).run(
          t ? t.getCompareExpression() : Exprs.true(),
        ),
      ),
    );
  }

  public getValueChangeExpression(newValue: Expression, from?: TraverseStep, to?: TraverseStep): Expression
  {
    // from & to = property
    const hasFrom = from !== null && from !== undefined;
    const hasTo = to !== null && to !== undefined;

    if (!hasFrom && hasTo) // add
    {
      return Exprs.define({ parent: Exprs.get('value') },
        Exprs.op(ObjectOps.set, {
          object: Exprs.get('value'),
          key: to,
          value: newValue,
        }),
      );
    } 
    else if (hasFrom && !hasTo) // remove
    {
      return Exprs.body(
        Exprs.op(ObjectOps.delete, {
          object: Exprs.get('value'),
          key: from,
        }),
        Exprs.get('value'),
      );
    } 
    else if (from !== to) // rename
    {
      return Exprs.body(
        Exprs.op(ObjectOps.set, {
          object: Exprs.get('value'),
          key: to,
          value: Exprs.get('value', from),
        }),
        Exprs.op(ObjectOps.delete, {
          object: Exprs.get('value'),
          key: from,
        }),
        Exprs.get('value'),
      );
    } 
    else if (from === to && hasFrom) // change
    { 
      return Exprs.body(
        Exprs.update('value', from)
          .to(newValue, 'value'),
        Exprs.get('value'),
      );
    }

    return newValue;
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

      if (!props[prop])
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
      props: objectMap(this.options.props, p => p ? p.clone() : p),
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
      if (props[prop])
      {
        out[prop] = props[prop].random(rnd);
      }
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