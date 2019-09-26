
import { objectMap, isObject, objectValues, isString, toArray } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider, TypeInputMap, TypeMap } from '../Type';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { ObjectOps, ObjectOperations } from '../ops/ObjectOps';
import { Definitions } from '../Definitions';
import { ConstantExpression } from '../exprs/Constant';
import { EnumType } from './Enum';
import { TextType } from './Text';
import { ID } from './ID';


const INDEX_PROPS = 1;

export interface ObjectOptions 
{
  props: TypeMap;
}

export class ObjectType extends Type<ObjectOptions> 
{

  public static propType = new TextType({});

  public static id = ID.Object;

  public static operations = ObjectOperations;

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

  public getId(): string
  {
    return ObjectType.id;
  }

  public getOperations()
  {
    return ObjectType.operations.map;
  }

  public merge(type: ObjectType, describer: TypeDescribeProvider): void
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

    return null;
  }

  public getSubTypes(): [TypeMap, Type[]]
  {
    return [this.options.props, [ObjectType.propType]];
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public getSimplifiedType(): Type 
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    if (!(other instanceof ObjectType)) 
    {
      return false;
    }

    const props = this.options.props;

    for (const prop in props) 
    {
      if (!other.options.props[prop]) 
      {
        return false;
      }
    }

    return true;
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.define({
      value: ex.op(ObjectOps.create, {})
    }, ex.body(
      ...objectValues(objectMap(this.options.props, (t, prop) => 
        ex.set('value', prop).to(t.getCreateExpression(ex)),
      )),
      ex.get('value'),
    ));
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.and(
      ex.op(ObjectOps.isValid, {
        value: ex.get('value'),
      }),
      ...objectValues(objectMap(this.options.props, (t, prop) =>
        ex.define({ 
          value: ex.get('value', prop) 
        }).run(
          t.getValidateExpression(ex),
        ),
      )),
    );
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return ex.or(
      ...objectValues(objectMap(this.options.props, (t, prop) =>
        ex.define({ 
          value: ex.get('value', prop),
          test: ex.get('test', prop) 
        }).run(
          t.getCompareExpression(ex),
        ),
      )),
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
      if (!props[prop].isValid(value[prop])) 
      {
        return false;
      }
    }

    return true;
  }

  public normalize(value: any): any
  {
    return value;
  }

  public newInstance(): ObjectType
  {
    return new ObjectType({ props: {} });
  }

  public clone(): ObjectType
  {
    return new ObjectType({
      props: objectMap(this.options.props, p => p.clone()),
    });
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

}