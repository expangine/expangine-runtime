
import { isBoolean, isEmpty, copy } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { NumberType } from './Number';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { BooleanOps, BooleanOperations } from '../ops/BooleanOps';
import { Definitions } from '../Definitions';
import { ID } from './ID';


const INDEX_OPTIONS = 1;
const RANDOM_TRUE_PROBABILITY = 0.5;

export interface BooleanOptions 
{
  true?: Record<string, true>;
  false?: Record<string, true>;
}

export class BooleanType extends Type<BooleanOptions> 
{

  public static id = ID.Boolean;

  public static operations = BooleanOperations;

  public static baseType = new BooleanType({});

  public static decode(data: any[], types: TypeProvider): BooleanType 
  {
    return new BooleanType(data[INDEX_OPTIONS] || {});
  }

  public static encode(type: BooleanType): any 
  {
    return isEmpty(type.options)
      ? this.id
      : [this.id, type.options];
  }

  public static describePriority: number = 4;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    return isBoolean(data) ? this.baseType : null;
  }

  public getId(): string
  {
    return BooleanType.id;
  }

  public getOperations()
  {
    return BooleanType.operations.map;
  }

  public merge(type: BooleanType, describer: TypeDescribeProvider): void
  {
    
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    return null;
  }

  public getSubTypes(): null
  {
    return null;
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    return other instanceof BooleanType || other instanceof NumberType;
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(BooleanOps.create, {});
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(BooleanOps.isValid, {
      value: ex.get('value'),
    });
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(BooleanOps.cmp, {
      value: ex.get('value'),
      test: ex.get('test'),
    });
  }

  public isValid(value: any): boolean 
  {
    if (isBoolean(value))
    {
      return true;
    }

    const asKey = value + '';

    if (this.options.true && this.options.true[asKey])
    {
      return true;
    }
    
    if (this.options.false && this.options.false[asKey])
    {
      return true;
    }

    return false;
  }

  public normalize(value: any): any
  {
    if (!isBoolean(value))
    {
      const asKey = value + '';

      if (this.options.true && this.options.true[asKey])
      {
        return true;
      }
      
      if (this.options.false && this.options.false[asKey])
      {
        return false;
      }
    }

    return value;
  }

  public newInstance(): BooleanType
  {
    return new BooleanType({});
  }

  public clone(): BooleanType
  {
    return new BooleanType(copy(this.options));
  }

  public encode(): any 
  {
    return BooleanType.encode(this);
  }

  public create(): boolean
  {
    return false;
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return rnd(0, 1, false) < RANDOM_TRUE_PROBABILITY;
  }

  public fromJson(json: boolean): boolean
  {
    return json;
  }

  public toJson(value: boolean): boolean
  {
    return value;
  }

}
