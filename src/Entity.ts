import { ObjectType } from './types/Object';
import { Definitions } from './Definitions';
import { Types } from './Types';
import { FuncOptions, Func } from './Func';
import { objectMap, objectReduce, isArray, objectEach } from './fns';
import { Type, TypeMap } from './Type';
import { Expression } from './Expression';
import { Exprs } from './Exprs';
import { Runtime } from './Runtime';
import { EnumType } from './types/Enum';
import { Relation } from './Relation';


export interface EntityOptions
{
  name: string;
  description: string;
  meta: any;
  type: any;
  instances: any[];
  key?: any;
  describe?: any;
  transcoders?: Record<string, EntityStorageTranscoderOptions>;
  indexes?: Record<string, EntityIndexOptions>;
  methods?: Record<string, Func | FuncOptions>;
}

export interface EntityIndex
{
  name: string;
  props: string[];
  types?: Type[];
  unique?: boolean;
  primary?: boolean;
}

export interface EntityIndexOptions
{
  props: string[];
  unique?: boolean;
  primary?: boolean;
}

export interface EntityStorageTranscoder
{
  encode: Expression;
  decode: Expression;
  encodedType: Type;
}

export interface EntityStorageTranscoderOptions
{
  encode: any;
  decode: any;
  encodedType: any;
}

export type EntityPropPair = [string, Type];

export interface EntityProps
{
  type: EntityKeyType;
  props: EntityPropPair[];
  relation?: Relation;
}

export enum EntityKeyType
{
  PRIMARY,
  FOREIGN,
  NONE
}

export enum EntityStoragePrimaryType
{
  GIVEN,
  AUTO_INCREMENT,
  UUID
}

export class Entity
{

  public static create(defs: Definitions, defaults: Partial<EntityOptions> = {}) {
    return new Entity({
      name: '',
      description: '',
      meta: null,
      type: Types.object(),
      instances: [],
      methods: Object.create(null),
      ...defaults,
    }, defs);
  }

  public static PRIMARY_TYPES: Record<EntityStoragePrimaryType, Type> = {
    [EntityStoragePrimaryType.GIVEN]: null,
    [EntityStoragePrimaryType.AUTO_INCREMENT]: Types.int(1),
    [EntityStoragePrimaryType.UUID]: Types.text({ min: 36, max: 36, forceLower: true, matches: /^[\da-f]{8}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{12}$/i }),
  };

  public name: string;
  public description: string;
  public meta: any;
  public type: ObjectType;
  public instances: any[];
  public methods: Record<string, Func>;
  public key: Expression;
  public keyType: Type;
  public describe: Expression;
  public transcoders: Record<string, EntityStorageTranscoder>;
  public indexes: Record<string, EntityIndex>;
  public primaryType: EntityStoragePrimaryType;

  public constructor(options: EntityOptions, defs: Definitions) {
    this.name = options.name;
    this.description = options.description;
    this.meta = options.meta;
    this.type = defs.getTypeKind(options.type, ObjectType, Types.object());
    this.instances = options.instances && options.instances.length
      ? options.instances.map((i) => this.type.fromJson(i))
      : [];
    this.methods = options.methods 
      ? objectMap(options.methods, (funcOptions) => funcOptions instanceof Func ? funcOptions : new Func(funcOptions, defs))
      : Object.create(null);
    this.key = options.key 
      ? defs.getExpression(options.key)
      : Exprs.get('instance', this.getDynamicPrimaryKey());
    this.keyType = this.key.getType(defs, this.getKeyContext());
    this.describe = options.describe
      ? defs.getExpression(options.describe)
      : Exprs.noop();
    this.transcoders = this.decodeTranscoders(defs, options.transcoders);
    this.indexes = this.decodeIndexes(options.indexes);
    this.primaryType = EntityStoragePrimaryType.AUTO_INCREMENT;
  }

  private decodeTranscoders(defs: Definitions, transcoders?: Record<string, EntityStorageTranscoderOptions>)
  {
    return transcoders
      ? objectMap(transcoders, (t) => ({
          encode: defs.getExpression(t.encode),
          decode: defs.getExpression(t.decode),
          encodedType: defs.getType(t.encodedType),
        }))
      : {};
  }

  private decodeIndexes(indexes?: Record<string, EntityIndexOptions | EntityIndex>)
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

  public encode(): EntityOptions 
  {
    const { name, description, meta, type, instances, methods, key, describe, transcoders, indexes } = this;

    return {
      name,
      description,
      meta,
      type: type.encode(),
      instances: instances.map((i) => type.toJson(i)),
      methods: objectMap(methods, (m) => m.encode()),
      key: key.encode(),
      describe: describe.encode(),
      transcoders: objectMap(transcoders, ({ encode, decode, encodedType }) => ({
        encode: encode.encode(),
        decode: decode.encode(),
        encodedType: encodedType.encode(),
      })),
      indexes: objectMap(indexes, ({ props, unique, primary }) => ({
        props,
        unique,
        primary,
      })),
    };
  }

  public canStore(): boolean
  {
    return this.key !== Exprs.noop() && this.describe !== Exprs.noop();
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

  public getEntityProps(): EntityProps
  {
    const primary = this.getPrimary();
    const props: Array<[string, Type]> = primary.props.map((prop, i) => [
      prop,
      primary.types && primary.types[i]
        ? primary.types[i]
        : this.type.options.props[prop]
    ]);

    return {
      type: EntityKeyType.PRIMARY,
      props,
    };
  }

  public getKey(run: Runtime, instance: any): any
  {
    const { type, key } = this;

    return run.run(key, { instance, type });
  }

  public getDescribe(run: Runtime, instance: any): any
  {
    const { type, describe } = this;

    return run.run(describe, { instance, type });
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
    return Types.object(this.getEncodedPropertyTypes());
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

  public getKeyReturnType()
  {
    return this.keyType;
  }

  public getKeyContext(): Type
  {
    return Types.object({
      instance: this.type,
      type: Types.text(),
    });
  }

  public getDescribeContext(): Type
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

  public getPrimary(name: string = 'primary', returnDynamic: boolean = true): EntityIndex | null
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
      const type = Entity.PRIMARY_TYPES[this.primaryType];

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

  public getUniqueIndexes(): EntityIndex[]
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

    this.primaryType = EntityStoragePrimaryType.GIVEN;

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