import { Type } from './Type';
import { Definitions } from './Definitions';
import { Types } from './Types';
import { Expression } from './Expression';
import { Runtime } from './Runtime';
import { EventBase } from './EventBase';
import { DataTypes } from './DataTypes';
import { now } from './fns';


export interface ReferenceDataOptions
{
  name: string;
  created: number;
  updated: number;
  dataType: any;
  data: any;
  meta: any;
}

export interface ReferenceDataEvents
{
  changed(data: ReferenceData): void;
  renamed(data: ReferenceData, oldName: string): void;
  sync(data: ReferenceData, options: ReferenceDataOptions, defs: Definitions): void;
}

export class ReferenceData extends EventBase<ReferenceDataEvents> implements ReferenceDataOptions
{

  public static create(defs: Definitions, defaults: Partial<ReferenceDataOptions> = {}) {
    return new ReferenceData({
      name: '',
      created: now(),
      updated: now(),
      dataType: Types.object(),
      data: Object.create(null),
      meta: null,
      ...defaults,
    }, defs);
  }

  public name: string;
  public created: number;
  public updated: number;
  public dataType: Type;
  public data: any;
  public meta: any;

  public constructor(options: ReferenceDataOptions, defs: Definitions)
  {
    super();

    this.name = options.name;
    this.created = options.created || now();
    this.updated = options.updated || now();
    this.meta = options.meta;
    this.dataType = defs.getType(options.dataType);
    this.data = this.dataType.fromJson(options.data);
  }

  public sync(options: ReferenceDataOptions, defs: Definitions)
  {
    if (this.hasChanges(options))
    {
      this.name = options.name;
      this.created = options.created || now();
      this.updated = options.updated || now();
      this.meta = options.meta;
      this.dataType = options instanceof ReferenceData
        ? options.dataType
        : defs.getType(options.dataType);
      this.data = options instanceof ReferenceData
        ? options.data
        : this.dataType.fromJson(options.data);

      this.trigger('sync', this, options, defs);
      this.changed();
    }
  }

  public hasChanges(options: ReferenceDataOptions): boolean
  {
    return !DataTypes.equals(options instanceof ReferenceData ? options.encode() : options, this.encode());
  }

  public changed()
  {
    this.updated = now();

    this.trigger('changed', this);
  }

  public encode(): ReferenceDataOptions
  {
    const { name, created, updated, meta, dataType, data } = this;

    return {
      name,
      created,
      updated,
      meta,
      dataType: dataType.encode(),
      data: dataType.toJson(data),
    };
  }

  public refactor(transform: Expression, runtime: Runtime)
  {
    this.data = runtime.run(transform, { value: this.data });

    this.changed();
  }

}
