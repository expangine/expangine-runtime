import { Type } from './Type';
import { Definitions } from './Definitions';
import { Types } from './Types';
import { Expression } from './Expression';
import { Runtime } from './Runtime';


export interface ReferenceDataOptions
{
  name: string;
  dataType: any;
  data: any;
  meta: any;
}

export class ReferenceData
{

  public static create(defs: Definitions, defaults: Partial<ReferenceDataOptions> = {}) {
    return new ReferenceData({
      name: '',
      dataType: Types.object(),
      data: Object.create(null),
      meta: null,
      ...defaults,
    }, defs);
  }

  public name: string;
  public dataType: Type;
  public data: any;
  public meta: any;

  public constructor(options: ReferenceDataOptions, defs: Definitions)
  {
    this.name = options.name;
    this.meta = options.meta;
    this.dataType = defs.getType(options.dataType);
    this.data = this.dataType.fromJson(options.data);
  }

  public encode(): ReferenceDataOptions
  {
    const { name, meta, dataType, data } = this;

    return {
      name,
      meta,
      dataType: dataType.encode(),
      data: dataType.toJson(data),
    };
  }

  public refactor(transform: Expression, runtime: Runtime)
  {
    this.data = runtime.run(transform, { value: this.data });
  }

}
