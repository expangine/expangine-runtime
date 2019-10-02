
import { Type, TypeInput, TypeInputMap } from './Type';
import { ExpressionBuilder } from './ExpressionBuilder';
import { Expression } from './Expression';
import { NumberType } from './types/Number'
import { AnyType } from './types/Any';
import { BooleanType } from './types/Boolean';
import { DateOptions, DateType } from './types/Date';
import { TextType, TextOptions } from './types/Text';
import { EnumType } from './types/Enum';
import { ObjectType } from './types/Object';
import { FunctionType } from './types/Function';
import { ListType } from './types/List';
import { ManyType } from './types/Many';
import { isArray } from './fns';
import { MapType } from './types/Map';
import { NullType } from './types/Null';
import { OptionalType } from './types/Optional';
import { TupleType } from './types/Tuple';


export class TypeBuilder
{

  public any()
  {
    return new AnyType({});
  }

  public bool(trues?: Record<string, true>, falses?: Record<string, true>)
  {
    return new BooleanType({ true: trues, false: falses });
  }

  public date(options: DateOptions = {})
  {
    return new DateType(options);
  }

  public enum(value: TypeInput, key: TypeInput = TextType, constants: Map<any, any> = new Map([]))
  {
    return new EnumType({
      value: Type.fromInput(value),
      key: Type.fromInput(key),
      constants
    });
  }

  public func(returnType: TypeInput, params: TypeInputMap, getExpression: (ex: ExpressionBuilder) => Expression)
  {
    return new FunctionType({
      returnType: Type.fromInput(returnType),
      params: ObjectType.from(params),
      expression: getExpression(new ExpressionBuilder()),
    });
  }

  public list(item: TypeInput, min?: number, max?: number)
  {
    return new ListType({
      item: Type.fromInput(item),
      min, 
      max,
    });
  }

  public many(types: TypeInput[]): ManyType
  public many(...types: TypeInput[]): ManyType
  public many(...types: TypeInput[] | [TypeInput[]]): ManyType
  {
    return new ManyType(
      isArray(types[0])
        ? types[0].map(Type.fromInput)
        : (types as TypeInput[]).map(Type.fromInput)
    );
  }

  public map(value: TypeInput, key: TypeInput = TextType)
  {
    return new MapType({ 
      key: Type.fromInput(key),
      value: Type.fromInput(value)
    });
  }

  public null()
  {
    return new NullType({});
  }

  public number(min?: number, max?: number, whole?: boolean)
  {
    return new NumberType({ min, max, whole });
  }

  public int(min?: number, max?: number)
  {
    return new NumberType({ min, max, whole: true });
  }

  public object(props: TypeInputMap = {})
  {
    return ObjectType.from(props);
  }

  public optional(type: TypeInput)
  {
    return new OptionalType(Type.fromInput(type));
  }

  public text(options: TextOptions = {})
  {
    return new TextType(options);
  }

  public tuple(types: TypeInput[]): TupleType
  public tuple(...types: TypeInput[]): TupleType
  public tuple(...types: TypeInput[] | [TypeInput[]]): TupleType
  {
    return new TupleType(
      isArray(types[0])
        ? types[0].map(Type.fromInput)
        : (types as TypeInput[]).map(Type.fromInput)
    );
  }

}