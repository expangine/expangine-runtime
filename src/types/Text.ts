
import { isString, isNumber, isEmpty, coalesce, copy, toArray } from '../fns';
import { Type, TypeDescribeProvider } from '../Type';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { TextOps, TextOperations } from '../ops/TextOps';
import { ConstantExpression } from '../exprs/Constant';
import { NumberType } from './Number';
import { Definitions } from '../Definitions';
import { EnumType } from './Enum';
import { ID } from './ID';


const INDEX_OPTIONS = 1;
const RANDOM_MIN = 1;
const RANDOM_MAX = 16;
const RANDOM_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-+=:.';

export interface TextOptions 
{
  min?: number;
  max?: number;
  requireUpper?: boolean;
  requireLower?: boolean;
  forceUpper?: boolean;
  forceLower?: boolean;
  matches?: RegExp;
}

export class TextType extends Type<TextOptions> 
{

  public static id = ID.Text;

  public static operations = TextOperations;
  
  public static baseType = new TextType({});

  public static decode(data: any[]): TextType 
  {
    return new TextType(this.decodeOptions(data[INDEX_OPTIONS] || {}));
  }

  public static encode(type: TextType): any 
  {
    return isEmpty(type.options)
      ? this.id
      : [this.id, this.encodeOptions(type.options)];
  }

  private static decodeOptions(options: any): TextOptions
  {
    const matches = options.matches;

    if (matches) options.matches = new RegExp(matches[0], matches[1]);

    return options;
  }

  private static encodeOptions(options: TextOptions): any
  {
    const encoded: any = { ...options };
    const matches = encoded.matches;

    if (matches) encoded.matches = [matches.source, matches.flags];

    return encoded;
  }

  public static describePriority: number = 3;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    if (!isString(data))
    {
      return null;
    }

    return new TextType({
      min: data.length,
      max: data.length,
      requireLower: data.toLowerCase() === data,
      requireUpper: data.toUpperCase() === data
    });
  }

  public getId(): string
  {
    return TextType.id;
  }

  public getOperations()
  {
    return TextType.operations.map;
  }

  public merge(type: TextType, describer: TypeDescribeProvider): void
  {
    const o1 = this.options;
    const o2 = type.options;

    o1.max = Math.max(o1.max, o2.max);
    o1.min = Math.min(o1.min, o2.min);
    o1.requireLower = o1.requireLower && o2.requireLower;
    o1.requireUpper = o1.requireUpper && o2.requireUpper;
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    if (ConstantExpression.is(expr))
    {
      if (expr.value === 'length')
      {
        return NumberType.baseType;
      }

      if (isNumber(expr.value))
      {
        return TextType.baseType;
      }
    }

    const exprType = def.requiredType(expr.getType(def, context));

    if (exprType)
    {
      if (exprType instanceof NumberType)
      {
        return TextType.baseType;
      }

      if (exprType instanceof EnumType)
      {
        if (exprType.options.value instanceof NumberType)
        {
          return TextType.baseType;
        }

        if (exprType.options.value instanceof TextType)
        {
          const values = toArray(exprType.options.constants.values());

          if (values.length === 1 && values[0] === 'length')
          {
            return NumberType.baseType;
          }
        }
      }
    }
  }

  public getSubTypes(): null
  {
    return null;
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
    return other instanceof TextType;
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(TextOps.create, {});
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(TextOps.isValid, {
      value: ex.get('value'),
    });
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(TextOps.compare, {
      value: ex.get('value'),
      test: ex.get('test'),
      ignoreCase: ex.get(true),
    });
  }

  public isValid(value: any): boolean 
  {
    if (!isString(value))
    {
      return false;
    }

    const { min, max, requireLower, requireUpper, matches, forceLower, forceUpper } = this.options;

    if (isNumber(min) && value.length < min)
    {
      return false;
    }

    if (isNumber(max) && value.length > max)
    {
      return false;
    }

    if (requireLower && value !== value.toLowerCase() && !forceLower)
    {
      return false;
    }

    if (requireUpper && value !== value.toUpperCase() && !forceUpper)
    {
      return false;
    }

    if (matches && matches instanceof RegExp && !matches.test(value))
    {
      return false;
    }

    return true;
  }

  public normalize(value: any): any
  {
    if (isString(value))
    {
      if (this.options.forceLower)
      {
        value = value.toLowerCase();
      }

      if (this.options.forceUpper)
      {
        value = value.toUpperCase();
      }
    }

    return value;
  }

  public newInstance(): TextType
  {
    return new TextType({});
  }

  public clone(): TextType
  {
    return new TextType(copy(this.options));
  }

  public encode(): any 
  {
    return TextType.encode(this);
  }

  public create(): string
  {
    return '';
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const { min, max, requireLower, forceLower, requireUpper, forceUpper } = this.options;
    const lower = requireLower || forceLower;
    const upper = requireUpper || forceUpper;
    const chosenMin = coalesce(min, RANDOM_MIN);
    const chosenMax = coalesce(max, RANDOM_MAX);
    const n = rnd(chosenMin, chosenMax + 1, true);
    let out = '';

    for (let i = 0; i < n; i++)
    {
      out += RANDOM_CHARACTERS.charAt(rnd(0, RANDOM_CHARACTERS.length, true));
    }

    if (lower) out = out.toLowerCase();
    if (upper) out = out.toUpperCase();

    return out;
  }

  public fromJson(json: string): string
  {
    return json;
  }

  public toJson(value: string): string
  {
    return value;
  }

}