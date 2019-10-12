
import { isFunction } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { ObjectType } from './Object';
import { AnyType } from './Any';
import { Expression } from '../Expression';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Definitions } from '../Definitions';
import { ID } from './ID';
import { Traverser } from '../Traverser';


const INDEX_RETURN = 1;
const INDEX_PARAMS = 2;
const INDEX_EXPRESSION = 3;

export interface FunctionOptions 
{
  returnType: Type;
  params: ObjectType;
  expression: Expression;
}

export class FunctionType extends Type<FunctionOptions> 
{

  public static id = ID.Function;

  public static operations = new Operations(ID.Function + ':');

  public static baseType = new FunctionType({ returnType: AnyType.baseType, params: ObjectType.baseType, expression: null });

  public static decode(data: any[], types: TypeProvider): FunctionType
  {
    const returnType = types.getType(data[INDEX_RETURN]);
    const params = types.getType([ObjectType.id, data[INDEX_PARAMS]]) as ObjectType;
    const expression = types.getExpression(data[INDEX_EXPRESSION]);

    return new FunctionType({ returnType, params, expression });
  }

  public static encode(type: FunctionType): any 
  {
    const { returnType, params, expression } = type.options;
    
    return [
      this.id,
      returnType.encode(),
      params.encode(),
      expression.encode()
    ];
  }

  public static describePriority: number = -1;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    return null;
  }

  public getId(): string
  {
    return FunctionType.id;
  }

  public getOperations()
  {
    return FunctionType.operations.map;
  }

  public merge(type: FunctionType, describer: TypeDescribeProvider): void
  {
    
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    return null;
  }

  public getSubTypes(def: Definitions): TypeSub[]
  {
    return [];
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public getSimplifiedType(): Type
  {
    return this.options.returnType;
  }

  protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean 
  {
    return other instanceof FunctionType
      && this.options.returnType.isCompatible(other.options.returnType, options)
      && this.options.params.isCompatible(other.options.params, options);
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this, () => {
      traverse.step('returnType', this.options.returnType);
      traverse.step('params', this.options.params);
    });
  }

  public setParent(parent: Type = null): void
  {
    this.parent = parent;

    this.options.returnType.setParent(this);
    this.options.params.setParent(this);
  }

  public removeDescribedRestrictions(): void
  {
    
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return this.options.returnType.getCreateExpression(ex);
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return this.options.returnType.getValidateExpression(ex);
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return this.options.returnType.getCompareExpression(ex);
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
    const { returnType, params, expression } = this.options;

    return new FunctionType({
      returnType: returnType.newInstance(),
      params: params.newInstance(),
      expression, // TODO copy expression
    });
  }

  public clone(): FunctionType
  {
    const { returnType, params, expression } = this.options;

    return new FunctionType({
      returnType: returnType.clone(),
      params: params.clone(),
      expression, // TODO copy expression
    });
  }

  public encode(): any 
  {
    return FunctionType.encode(this);
  }

  public create(): any
  {
    return () => { /**/ };
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    return () => this.options.returnType.random(rnd);
  }

  public fromJson(json: any): any
  {
    // tslint:disable-next-line: prefer-const
    let fn = null;

    // tslint:disable-next-line: no-eval
    eval('fn = ' + json);

    return fn;
  }

  public toJson(value: any): any
  {
    return value.toString();
  }

}