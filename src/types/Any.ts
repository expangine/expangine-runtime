
import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
import { AnyOps, AnyOperations } from '../ops/AnyOps';
import { ID } from './ID';
import { Traverser } from '../Traverser';


export class AnyType extends Type 
{

  public static id = ID.Any;

  public static operations = AnyOperations;

  public static baseType = new AnyType({});

  public static decode(data: any[], types: TypeProvider): AnyType 
  {
    return this.baseType;
  }

  public static encode(type: AnyType): any 
  {
    return this.id
  }

  public static describePriority: number = 0;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    return this.baseType;
  }

  public getId(): string
  {
    return AnyType.id;
  }

  public getOperations()
  {
    return AnyType.operations.map;
  }

  public merge(type: AnyType, describer: TypeDescribeProvider): void
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

  public getSimplifiedType(): Type
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    return true;
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this);
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.string();
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.true();
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(AnyOps.cmp, {
      value: ex.get('value'),
      test: ex.get('test'),
    });
  }

  public isValid(value: any): boolean 
  {
    return true;
  }

  public normalize(value: any): any
  {
    return value;
  }

  public newInstance(): AnyType
  {
    return new AnyType({});
  }

  public clone(): AnyType
  {
    return new AnyType({});
  }

  public encode(): any 
  {
    return AnyType.encode(this);
  }

  public create(): any
  {
    return '';
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return null;
  }

  public fromJson(json: any): any
  {
    return json;
  }

  public toJson(value: any): any
  {
    return value;
  }

}
