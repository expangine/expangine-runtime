import { Type } from './Type';
import { Expression } from './Expression';
import { Definitions } from './Definitions';
import { Types } from './Types';
import { NoExpression } from './exprs/No';
import { Runtime } from './Runtime';


export interface ProgramOptions
{
  name: string;
  author: string;
  description: string;
  meta: any;
  created: number;
  updated: number;
  dataType: any;
  datasets: ProgramDataSet[];
  expression: any;
}

export interface ProgramDataSet
{
  name: string;
  data: any;
  created: number;
  updated: number;
  meta: any;
}

export class Program
{

  public static create(defs: Definitions, defaults: Partial<ProgramOptions> = {}): Program {
    const now = new Date().getTime();

    return new Program({
      name,
      author: '',
      description: '',
      meta: null,
      created: now,
      updated: now,
      dataType: Types.object(),
      datasets: [{
        name: 'Data Set #1',
        data: Object.create(null),
        created: now,
        updated: now,
        meta: null,
      }],
      expression: NoExpression.instance,
      ...defaults,
    }, defs);
  }

  public name: string;
  public author: string;
  public description: string;
  public meta: any;
  public created: number;
  public updated: number;
  public dataType: Type;
  public datasets: ProgramDataSet[];
  public expression: Expression;

  public constructor(options: ProgramOptions, defs: Definitions) 
  {
    this.name = options.name;
    this.author = options.author;
    this.description = options.description;
    this.meta = options.meta;
    this.created = options.created;
    this.updated = options.updated;
    this.dataType = defs.getType(options.dataType);
    this.datasets = options.datasets.map((d) => ({ ...d, data: this.dataType.fromJson(d.data) }));
    this.expression = defs.getExpression(options.expression);
  }

  public encode(): ProgramOptions 
  {
    const { name, author, description, meta, created, updated, dataType, datasets, expression } = this;

    return {
      name,
      author,
      description,
      meta,
      created,
      updated,
      dataType: dataType.encode(),
      datasets: datasets.map((d) => ({ ...d, data: dataType.toJson(d.data) })),
      expression: expression.encode(),
    };
  }

  public refactor(transform: Expression, runtime: Runtime)
  {
    const cmd = runtime.getCommand(transform);

    this.datasets.forEach((dataset) => 
    {
      dataset.data = cmd({ value: dataset.data });
    });
  }
  
}