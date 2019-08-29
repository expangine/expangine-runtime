
import { isFunction } from '../fns';
import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { ObjectType } from './Object';
import { AnyType } from './Any';
import { Expression } from '../Expression';


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

  public static id = 'func';

  public static operations = new Operations<FunctionType>('func:');

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

  public merge(type: FunctionType, describer: TypeDescribeProvider): void
  {
    
  }

  public getSubTypes() 
  {
    const { returnType, params } = this.options;

    return { returnType, params };
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    return other instanceof FunctionType
      && this.options.returnType.isCompatible(other.options.returnType)
      && this.options.params.isCompatible(other.options.params);
  }

  public isValid(value: any): boolean 
  {
    return isFunction(value);
  }

  public normalize(value: any): any
  {
    return value;
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