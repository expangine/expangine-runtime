
import { Type, TypeProvider, TypeDescribeProvider, TypeInput, TypeSub } from '../Type';
import { isArray, isNumber, toArray } from '../fns';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { TupleOps, TupleOperations } from '../ops/TupleOps';
import { NumberOps } from '../ops/NumberOps';
import { Definitions } from '../Definitions';
import { ConstantExpression } from '../exprs/Constant';
import { NumberType } from './Number';
import { EnumType } from './Enum';
import { TextType } from './Text';
import { ID } from './ID';
import { Traverser } from '../Traverser';


const INDEX_ELEMENTS = 1;

export class TupleType extends Type<Type[]>
{

  public static lengthType = new NumberType({min: 0, whole: true});

  public static indexType = new NumberType({min: 0, whole: true});

  public static id = ID.Tuple;

  public static operations = TupleOperations;

  public static baseType = new TupleType([]);

  public static decode(data: any[], types: TypeProvider): TupleType 
  {
    const elements = data[INDEX_ELEMENTS].map((d: any) => types.getType(d));

    return new TupleType(elements);
  }

  public static encode(type: TupleType): any 
  {
    const elements = type.options.map(t => t.encode());

    return [this.id, elements];
  }

  public static describePriority: number = -1;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    return null;
  }

  public static forItem(types: TypeInput[])
  {
    return new TupleType(types.map((t) => Type.fromInput(t)));
  }

  public getId(): string
  {
    return TupleType.id;
  }

  public getOperations()
  {
    return TupleType.operations.map;
  }

  public merge(type: TupleType, describer: TypeDescribeProvider): void
  {
    
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    if (ConstantExpression.is(expr))
    {
      if (expr.value === 'length')
      {
        return TupleType.lengthType;
      }

      if (isNumber(expr.value))
      {
        return this.options[expr.value];
      }
    }

    const exprType = def.requiredType(expr.getType(def, context));

    if (exprType)
    {
      if (exprType instanceof NumberType)
      {
        return def.mergeTypes(this.options);
      }

      if (exprType instanceof EnumType)
      {
        if (exprType.options.value instanceof NumberType)
        {
          const values = toArray(exprType.options.constants.values());
          const types = values.map((i: number) => this.options[i]).filter(t => !!t);
          
          return def.mergeTypes(types);
        }

        if (exprType.options.value instanceof TextType)
        {
          const values = toArray(exprType.options.constants.values());

          if (values.length === 1 && values[0] === 'length')
          {
            return TupleType.lengthType;
          }
        }
      }
    }
  }

  public getSubTypes(def: Definitions): TypeSub[]
  {
    return [
      ...this.options.map((value, key) => ({ key, value })),
      { key: 'length', value: TupleType.lengthType },
      { key: TupleType.indexType, value: def.mergeTypes(this.options) },
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

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.define({
      value: ex.op(TupleOps.create, {}),
    }, ex.body(
      ...this.options.map((t, i) => 
        ex.set('value', i).to(t.getCreateExpression(ex))
      ),
      ex.get('value')
    ));
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return ex
      .op(TupleOps.isValid, {
        value: ex.get('value'),
      })
      .and(this.options.map((t, i) => ex
        .define({ value: ex.get('value', i) })
        .run(t.getValidateExpression(ex)),
      ),
    );
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return ex.or(
      ex.op(NumberOps.cmp, {
        value: ex.get('value', 'length'),
        test: ex.get('test', 'length'),
      }),
      ...this.options.map((t, i) => ex
        .define({
          value: ex.get('value', i),
          test: ex.get('test', i),
        })
        .run(t.getCompareExpression(ex)),
      ),
    );
  }

  public isCompatible(other: Type): boolean 
  {
    if (!(other instanceof TupleType))
    {
      return false;
    }

    const a = this.options;
    const b = other.options;

    if (a.length !== b.length)
    {
      return false;
    }

    for (let i = 0; i < a.length; i++)
    {
      if (!a[i].isCompatible(b[i]))
      {
        return false;
      }
    }

    return true;
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this, () =>
      this.options.map((type, index) => traverse.step(index, type))
    );
  }

  public setParent(parent?: Type): void
  {
    this.parent = parent;

    this.options.forEach(t => t.setParent(this));
  }

  public isValid(value: any): boolean 
  {
    if (!isArray(value))
    {
      return false;
    }

    const elements = this.options;

    for (let i = 0; i < elements.length; i++)
    {
      if (!elements[i].isValid(value[i]))
      {
        return false;
      }
    }

    return true;
  }

  public normalize(value: any): any
  {
    if (!isArray(value))
    {
      return value;
    }

    const elements = this.options;

    for (let i = 0; i < elements.length; i++)
    {
      value[i] = elements[i].normalize(value[i]);
    }

    return value;
  }

  public newInstance(): TupleType
  {
    return new TupleType([]);
  }

  public clone(): TupleType
  {
    return new TupleType(this.options.map(e => e.clone()));
  }

  public encode(): any 
  {
    return TupleType.encode(this);
  }

  public create(): any[]
  {
    return this.options.map(e => e.create());
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return this.options.map(e => e.random(rnd));
  }

  public fromJson(json: any[]): any[]
  {
    return this.options.map((e, i) => e.fromJson(json[i]));
  }

  public toJson(value: any[]): any[]
  {
    return this.options.map((e, i) => e.toJson(value[i]));
  }

}
