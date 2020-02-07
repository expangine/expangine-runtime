
import { Type, TypeInput, TypeInputMap } from './Type';
import { ExpressionBuilder, Exprs } from './ExpressionBuilder';
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
import { isArray, isMap, MapInput, toMap } from './fns';
import { MapType } from './types/Map';
import { NullType } from './types/Null';
import { OptionalType } from './types/Optional';
import { TupleType } from './types/Tuple';
import { NotType } from './types/Not';
import { ColorType } from './types/Color';
import { SetType } from './types/Set';


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

  public enum(value: TypeInput, key: TypeInput = TextType, constants: MapInput = new Map([]))
  {
    return new EnumType({
      value: Type.fromInput(value),
      key: Type.fromInput(key),
      constants: toMap(constants),
    });
  }

  public enumForText(constants: string[] | Array<[string, string]> | Map<string, string>)
  {
    return new EnumType({
      value: this.text(),
      key: this.text(),
      constants: isMap(constants)
        ? constants
        : isArray(constants[0])
          ? new Map(constants as Array<[string, string]>)
          : new Map((constants as string[]).map((c) => [c, c]))
    });
  }

  public func(returnType: TypeInput, params: TypeInputMap, getExpression: (ex: ExpressionBuilder) => Expression)
  {
    return new FunctionType({
      returnType: Type.fromInput(returnType),
      params: ObjectType.from(params),
      expression: getExpression(Exprs),
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

  public not(types: TypeInput[]): NotType
  public not(...types: TypeInput[]): NotType
  public not(...types: TypeInput[] | [TypeInput[]]): NotType
  {
    return new NotType(
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

  public color(options: { hasAlpha?: boolean } = {})
  {
    return new ColorType(options);
  }

  public set(value: TypeInput)
  {
    return new SetType({
      value: Type.fromInput(value),
    });
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

export const Types = new TypeBuilder();