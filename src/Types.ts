
import { Type, TypeInput, TypeInputMap, TypeClass, TypeResolved, TypeProvider } from './Type';
import { isArray, isMap, MapInput, toMap, isSameClass, isObject, objectMap } from './fns';
import { NumberType } from './types/Number'
import { AnyType } from './types/Any';
import { BooleanType } from './types/Boolean';
import { DateOptions, DateType } from './types/Date';
import { TextType, TextOptions } from './types/Text';
import { EnumType } from './types/Enum';
import { ObjectType } from './types/Object';
import { ListType } from './types/List';
import { ManyType } from './types/Many';
import { MapType } from './types/Map';
import { NullType } from './types/Null';
import { OptionalType } from './types/Optional';
import { TupleType } from './types/Tuple';
import { NotType } from './types/Not';
import { ColorType } from './types/Color';
import { SetType } from './types/Set';
import { EntityType } from './types/Entity';


export class Types
{

  public static INDEX = Types.index();

  public static LENGTH = Types.index();

  public static CHAR = Types.char();

  public static autoSetParent: boolean = true;

  public static setParent<T extends Type>(type: T, force: boolean = false): T
  {
    if (this.autoSetParent || force)
    {
      type.setParent();
    }

    return type;
  }

  public static any()
  {
    return new AnyType({});
  }

  public static bool(trues?: Record<string, true>, falses?: Record<string, true>)
  {
    return new BooleanType({ true: trues, false: falses });
  }

  public static date(options: DateOptions = {})
  {
    return new DateType(options);
  }

  public static entity(name: string, types: TypeProvider)
  {
    return new EntityType(name, types);
  }

  public static enum(value: TypeInput, key: TypeInput = TextType, constants: MapInput = new Map([]))
  {
    return this.setParent(new EnumType({
      value: this.parse(value),
      key: this.parse(key),
      constants: toMap(constants),
    }));
  }

  public static enumForText(constants: string[] | Array<[string, string]> | Map<string, string>)
  {
    return this.setParent(new EnumType({
      value: this.text(),
      key: this.text(),
      constants: isMap(constants)
        ? constants
        : isArray(constants[0])
          ? new Map(constants as Array<[string, string]>)
          : new Map((constants as string[]).map((c) => [c, c]))
    }));
  }

  public static list(item: TypeInput, min?: number, max?: number)
  {
    return this.setParent(new ListType({
      item: this.parse(item),
      min, 
      max,
    }));
  }

  public static many(types: TypeInput[]): ManyType
  public static many(...types: TypeInput[]): ManyType
  public static many(...types: TypeInput[] | [TypeInput[]]): ManyType
  {
    return this.setParent(new ManyType(
      isArray(types[0])
        ? types[0].map((t) => this.parse(t))
        : (types as TypeInput[]).map((t) => this.parse(t))
    ));
  }

  public static not(types: TypeInput[]): NotType
  public static not(...types: TypeInput[]): NotType
  public static not(...types: TypeInput[] | [TypeInput[]]): NotType
  {
    return this.setParent(new NotType(
      isArray(types[0])
        ? types[0].map((t) => this.parse(t))
        : (types as TypeInput[]).map((t) => this.parse(t))
    ));
  }

  public static map(value: TypeInput, key: TypeInput = TextType)
  {
    return this.setParent(new MapType({ 
      key: this.parse(key),
      value: this.parse(value)
    }));
  }

  public static null()
  {
    return NullType.baseType
  }

  public static number(min?: number, max?: number, whole?: boolean)
  {
    return new NumberType({ min, max, whole });
  }

  public static int(min?: number, max?: number)
  {
    return new NumberType({ min, max, whole: true });
  }

  public static index(max?: number)
  {
    return new NumberType({ min: 0, max, whole: true });
  }

  public static char()
  {
    return new TextType({ min: 1, max: 1 });
  }

  public static object(props: TypeInputMap = {})
  {
    return this.setParent(new ObjectType({ 
      props: this.resolve(props),
    }));
  }

  public static optional(type: TypeInput): Type
  {
    const innerType = this.parse(type);

    return this.setParent(innerType.isOptional() ? innerType : new OptionalType(innerType));
  }

  public static color(options: { hasAlpha?: boolean } = {})
  {
    return this.setParent(new ColorType(options));
  }

  public static set(value: TypeInput)
  {
    return this.setParent(new SetType({
      value: this.parse(value),
    }));
  }

  public static text(options: TextOptions = {})
  {
    return new TextType(options);
  }

  public static tuple(types: TypeInput[]): TupleType
  public static tuple(...types: TypeInput[]): TupleType
  public static tuple(...types: TypeInput[] | [TypeInput[]]): TupleType
  {
    return this.setParent(new TupleType(
      isArray(types[0])
        ? types[0].map((t) => this.parse(t))
        : (types as TypeInput[]).map((t) => this.parse(t))
    ));
  }

  public static parse(input: TypeInput): Type
  {
    return input instanceof Type
      ? input
      : input.baseType.newInstance();
  }

  public static simplify(type: Type): Type;
  public static simplify(type: Type | null): Type | null;
  public static simplify(type: Type | null): Type | null
  {
    return type ? type.getSimplifiedType() : null;
  }

  public static resolve<T>(types: T): TypeResolved<T>
  {
    let result: any;

    if (!types)
    {
    }
    else if (types instanceof Type)
    {
      result = types;
    }
    else if ((types as any).baseType instanceof Type)
    {
      result = (types as any).baseType.newInstance();
    }
    else if (isArray(types))
    {
      result = types.map(t => this.resolve(t));
    }
    else if (isObject(types))
    {
      result = objectMap(types as any, t => this.resolve(t));
    }

    return result as unknown as TypeResolved<T>;
  }

  public static reduce(type: Type[]): Type
  {
    return type.length === 1 ? type[0] : new ManyType(type);
  }

  public static explode(outerType: Type): Type[]
  {
    return outerType instanceof ManyType ? outerType.options : [outerType];
  }

  public static maybe<M extends Type>(type: Type, maybe: TypeClass<M>)
  {
    if (type instanceof maybe)
    {
      return type;
    }

    if (type instanceof OptionalType && type.options instanceof maybe)
    {
      return type;
    }

    if (type instanceof ManyType) 
    {
      const oneOf = type.options.find((t) => t instanceof maybe);

      if (oneOf) 
      {
        return this.optional(oneOf);
      }

      const oneOfOptional = type.options.find((t) => t instanceof OptionalType && t.options instanceof maybe);

      if (oneOfOptional) 
      {
        return oneOfOptional;
      }
    }

    return this.optional(maybe);
  }

  public static mergeMany(readonlyTypes: Type[]): Type | null;
  public static mergeMany(readonlyTypes: Type[], noTypes: Type): Type;
  public static mergeMany(readonlyTypes: Type[], noTypes: Type | null = null): Type | null
  {
    if (readonlyTypes.length === 0)
    {
      return noTypes;
    }

    if (readonlyTypes.find(t => t instanceof AnyType))
    {
      return AnyType.baseType;
    }

    const cloned = readonlyTypes.map(t => t ? t.clone() : null);

    return cloned.reduce((a, b) => a && b ? this.merge(a, b) : a || b);
  }

  public static merge(a: Type, b: Type): Type
  {
    if (a instanceof AnyType)
    {
      return b;
    }

    const optional = 
      a instanceof OptionalType ||
      b instanceof OptionalType;

    const ar = a.getRequired();
    const br = b.getRequired();

    if (isSameClass(ar, br))
    {
      ar.merge(br);

      return optional ? this.optional(ar) : ar;
    }

    if (ar instanceof ManyType || br instanceof ManyType)
    {
      const atypes = this.explode(ar);
      const btypes = this.explode(br);
      const an = atypes.length;

      for (const ktype of btypes)
      {
        let matched = false;
        const koptional = ktype instanceof OptionalType;
        const krequired: Type = koptional ? ktype.options : ktype;

        for (let i = 0; i < an; i++)
        {
          const itype = atypes[i];
          const ioptional = itype instanceof OptionalType;
          const irequired: Type = ioptional ? itype.options : itype;

          if (isSameClass(irequired, krequired))
          {
            matched = true;
            irequired.merge(krequired);

            if (koptional && !ioptional) 
            {
              atypes[i] = this.optional(irequired);
            }
          }
        }

        if (!matched)
        {
          atypes.push(ktype);
        }
      }

      return optional
        ? this.optional(this.reduce(atypes))
        : this.reduce(atypes);
    }

    return this.many(a, b);
  }

}