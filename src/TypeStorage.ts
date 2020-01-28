
import { objectMap, isEmpty, isArray, objectReduce, objectEach } from './fns';
import { Expression } from './Expression';
import { Definitions } from './Definitions';
import { Types } from './TypeBuilder';
import { Runtime } from './Runtime';
import { Type, TypeMap, TypeProps, TypeKeyType } from './Type';
import { Exprs } from './ExpressionBuilder';
import { ObjectType } from './types/Object';
import { EnumType } from './types/Enum';


export interface TypeIndex
{
  name: string;
  props: string[];
  types?: Type[];
  unique?: boolean;
  primary?: boolean;
}

export interface TypeIndexOptions
{
  props: string[];
  unique?: boolean;
  primary?: boolean;
}

export interface TypeStorageOptions
{
  name: string;
  key?: any;
  transcoders?: Record<string, TypeStorageTranscoderOptions>;
  indexes?: Record<string, TypeIndexOptions>;
}

export interface TypeStorageTranscoder
{
  encode: Expression;
  decode: Expression;
  encodedType: Type;
}

export interface TypeStorageTranscoderOptions
{
  encode: any;
  decode: any;
  encodedType: any;
}

export enum TypeStoragePrimaryType
{
  GIVEN,
  AUTO_INCREMENT,
  UUID
}

export class TypeStorage
{

  public static PRIMARY_TYPES: Record<TypeStoragePrimaryType, Type> = {
    [TypeStoragePrimaryType.GIVEN]: null,
    [TypeStoragePrimaryType.AUTO_INCREMENT]: Types.number(1, undefined, true),
    [TypeStoragePrimaryType.UUID]: Types.text({ min: 36, max: 36, forceLower: true, matches: /^[\da-f]{8}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{12}$/i }),
  };

  public name: string;
  public type: ObjectType;
  public key: Expression;
  public transcoders: Record<string, TypeStorageTranscoder>;
  public indexes: Record<string, TypeIndex>;
  public primaryType: TypeStoragePrimaryType;
  
  public constructor(options: TypeStorageOptions | TypeStorage, defs: Definitions)
  {
    this.name = options.name;
    this.type = defs.getType(options.name) as ObjectType;
    this.key = options.key 
      ? defs.getExpression(options.key)
      : Exprs.get('instance', this.getDynamicPrimaryKey());
    this.transcoders = this.decodeTranscoders(defs, options.transcoders);
    this.indexes = this.decodeIndexes(defs, options.indexes);
    this.primaryType = TypeStoragePrimaryType.AUTO_INCREMENT;
  }

  private decodeTranscoders(defs: Definitions, transcoders?: Record<string, TypeStorageTranscoderOptions>)
  {
    return transcoders
      ? objectMap(transcoders, (t) => ({
          encode: defs.getExpression(t.encode),
          decode: defs.getExpression(t.decode),
          encodedType: defs.getType(t.encodedType),
        }))
      : {};
  }

  private decodeIndexes(defs: Definitions, indexes?: Record<string, TypeIndexOptions | TypeIndex>)
  {
    return indexes
      ? objectMap(indexes, ({ unique, primary, props }, name) => ({
          name,
          props,
          unique,
          primary,
        }))
      : {};
  }

  public encode(): TypeStorageOptions
  {
    const { name, key, transcoders, indexes } = this;

    const options: TypeStorageOptions = {
      name,
      key: key.encode(),
    };

    if (!isEmpty(transcoders)) 
    {
      options.transcoders = objectMap(transcoders, ({ encode, decode, encodedType }) => ({
        encode: encode.encode(),
        decode: decode.encode(),
        encodedType: encodedType.encode(),
      }));
    }

    if (!isEmpty(indexes)) 
    {
      options.indexes = objectMap(indexes, ({ props, unique, primary }) => ({
        props,
        unique,
        primary,
      }));
    }

    return options;
  }

  public renameProp(prop: string, newProp: string)
  {
    if (prop in this.transcoders)
    {
      this.transcoders[newProp] = this.transcoders[prop];

      delete this.transcoders[prop];
    }

    objectEach(this.indexes, (index) =>
    {
      const i = index.props.indexOf(prop);

      if (i !== -1)
      {
        index.props[i] = newProp;
      }
    });
  }

  public removeProp(prop: string)
  {
    delete this.transcoders[prop];

    objectEach(this.indexes, (index, indexName) =>
    {
      const i = index.props.indexOf(prop);

      if (i !== -1)
      {
        index.props.splice(i, 1);

        if (index.props.length === 0)
        {
          delete this.indexes[indexName];
        }
      }
    });
  }

  public getTypeProps(): TypeProps
  {
    const primary = this.getPrimary();
    const props: Array<[string, Type]> = primary.props.map((prop, i) => [
      prop,
      primary.types && primary.types[i]
        ? primary.types[i]
        : this.type.options.props[prop]
    ]);

    return {
      type: TypeKeyType.PRIMARY,
      props,
    };
  }

  public getKey(run: Runtime, instance: any): any
  {
    const { type, key } = this;

    return run.run(key, { instance, type });
  }

  public getDecodedPropertyTypes(): TypeMap
  {
    return this.type.options.props;
  }

  public getPropertyTypeFor(forProperty?: string)
  {
    return forProperty
    ? Types.enumForText([forProperty])
    : this.getPropertyType(); 
  }

  public getEncodedPropertyTypes(): TypeMap
  {
    return objectMap(this.type.options.props, 
      (type, prop) => prop in this.transcoders
        ? this.transcoders[prop].encodedType
        : type
    );
  }

  public getEncodedType(): ObjectType
  {
    return ObjectType.from(this.getEncodedPropertyTypes());
  }

  public getDecodedType(): ObjectType
  {
    return this.type;
  }

  public getProperties(): string[]
  {
    return Object.keys(this.getDecodedPropertyTypes());
  }

  public getPropertyType(): EnumType
  {
    return Types.enumForText(this.getProperties());
  }

  public getKeyContext(): Type
  {
    return Types.object({
      instance: this.type,
      type: Types.text(),
    });
  }

  public getEncoded(run: Runtime, instance: any): any
  {
    const encoded: any = {};

    for (const prop in this.getDecodedPropertyTypes())
    {
      encoded[prop] = this.getEncodedValue(run, instance, prop);
    }

    return encoded;
  }

  public getEncodedValue(run: Runtime, instance: any, property: string): any
  {
    const { name, transcoders } = this;
    const encoder = property in transcoders
      ? transcoders[property].encode
      : null;
    const value = instance[property];

    return encoder
      ? run.run(encoder, { name, instance, property, value })
      : value;
  }

  public getEncodeContext(forProperty?: string): ObjectType
  {
    const name = Types.enumForText([this.name]);
    const instance = this.getDecodedType();
    const property = this.getPropertyTypeFor(forProperty);
    const value = this.getDecodeExpected(forProperty);

    return Types.object({ name, instance, property, value });
  }

  public getEncodeExpected(forProperty?: string)
  {
    return forProperty && forProperty in this.transcoders
      ? this.transcoders[forProperty].encodedType
      : Types.any();
  }

  public getDecoded(run: Runtime, encoded: any): any
  {
    const instance: any = {};

    for (const prop in this.getDecodedPropertyTypes())
    {
      instance[prop] = this.getDecodedValue(run, encoded, prop);
    }

    return instance;
  }

  public getDecodedValue(run: Runtime, instance: any, property: string): any
  {
    const { name, transcoders } = this;
    const decoder = property in transcoders
      ? transcoders[property].decode
      : null;
    const value = instance[property];

    return decoder
      ? run.run(decoder, { name, instance, property, value })
      : value;
  }

  public getDecodeContext(forProperty?: string): ObjectType
  {
    const name = Types.enumForText([this.name]);
    const instance = this.getEncodedType();
    const property = this.getPropertyTypeFor(forProperty);
    const value = this.getEncodeExpected(forProperty);

    return Types.object({ name, instance, property, value });
  }

  public getDecodeExpected(forProperty?: string)
  {
    return forProperty
      ? this.type.options.props[forProperty] || Types.any()
      : Types.any();
  }

  public getIndexExpectedType()
  {
    return Types.set(this.getPropertyType());
  }

  public getDynamicPrimaryKey(): string
  {
    const existing = this.type.options.props;

    return !('id' in existing)
      ? 'id'
      : !('_id' in existing)
        ? '_id'
        : '__id';
  }

  public getPrimary(name: string = 'primary', returnDynamic: boolean = true): TypeIndex | null
  {
    const defined = name in this.indexes
      ? this.indexes[name]
      : objectReduce(this.indexes, 
          (index, indexName, first) => first ? first : index.primary ? index : first, 
        null);

    if (defined)
    {
      return defined;
    }

    if (returnDynamic)
    {
      const id = this.getDynamicPrimaryKey();
      const type = TypeStorage.PRIMARY_TYPES[this.primaryType];

      return {
        name,
        props: [id],
        types: [type],
        unique: true,
        primary: true,
      };
    }

    return null;
  }

  public getUniqueIndexes(): TypeIndex[]
  {
    return objectReduce(this.indexes, (index, indexName, unique) => {
      if (index.unique) {
        unique.push(index);
      }

      return unique;
    }, []);
  }

  public addPrimary(props: string | string[]): this
  {
    const key = isArray(props) ? props : [props];

    this.addIndex('primary', key, true, true);

    this.primaryType = TypeStoragePrimaryType.GIVEN;

    return this;
  }

  public addIndex(name: string, props: string[], unique: boolean = false, primary: boolean = false): this
  {
    this.indexes[name] = {
      name, 
      props,
      unique,
      primary,
    };

    return this;
  }

}