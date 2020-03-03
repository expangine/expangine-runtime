import { Type } from './Type';
import { Expression } from './Expression';
import { Definitions } from './Definitions';
import { Types } from './Types';
import { NoExpression } from './exprs/No';
import { Runtime } from './Runtime';
import { EventBase } from './EventBase';
import { DataTypes } from './DataTypes';
import { arraySync, isNumber } from './fns';


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

export interface ProgramEvents
{
  changed(program: Program): void;
  renamed(program: Program, oldName: string): void;
  sync(program: Program, options: ProgramOptions, defs: Definitions): void;
  addDataset(program: Program, dataset: ProgramDataSet): void;
  removeDataset(program: Program, dataset: ProgramDataSet): void;
  updateDataset(program: Program, dataset: ProgramDataSet): void;
}

export class Program extends EventBase<ProgramEvents> implements ProgramOptions
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
    super();

    this.name = options.name;
    this.author = options.author;
    this.description = options.description;
    this.meta = options.meta;
    this.created = options.created;
    this.updated = options.updated;
    this.dataType = defs.getType(options.dataType);
    this.expression = defs.getExpression(options.expression);
    this.datasets = options.datasets.map((d) => ({ ...d, data: this.dataType.fromJson(d.data) }));
  }

  public sync(options: ProgramOptions, defs: Definitions)
  {
    if (this.hasChanges(options))
    {
      this.name = options.name;
      this.author = options.author;
      this.description = options.description;
      this.meta = options.meta;
      this.created = options.created;
      this.updated = options.updated;
      this.dataType = options instanceof Program
        ? options.dataType
        : defs.getType(options.dataType);
      this.expression = options instanceof Program
        ? options.expression
        : defs.getExpression(options.expression);

      arraySync(
        this.datasets, 
        options instanceof Program
          ? options.datasets
          : options.datasets.map((d) => ({ ...d, data: this.dataType.fromJson(d.data) })),
        (a, b) => a.name === b.name || a.created === b.created,
        (target, value) => this.addDataset(value, true),
        (target, index, value) => this.removeDataset(index, true),
        (target, index, value, newValue) => this.updateDataset(value, newValue, true),
      );

      this.trigger('sync', this, options, defs);
      this.changed();
    }
  }

  public hasChanges(options: ProgramOptions): boolean
  {
    return !DataTypes.equals(options instanceof Program ? options.encode() : options, this.encode());
  }

  public changed()
  {
    this.trigger('changed', this);
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

  public addDataset(dataset: ProgramDataSet, delayChange: boolean = false)
  {
    this.datasets.push(dataset);

    this.trigger('addDataset', this, dataset);

    if (!delayChange)
    {
      this.changed();
    }
  }

  public updateDataset(dataset: ProgramDataSet | number, newDataset: ProgramDataSet, delayChange: boolean = false): boolean
  {
    const target = isNumber(dataset)
      ? this.datasets[dataset]
      : dataset;
    const exists = !!target;

    if (exists)
    {
      Object.assign(target, newDataset);

      this.trigger('updateDataset', this, target);

      if (!delayChange)
      {
        this.changed();
      }
    }

    return exists;
  }

  public removeDataset(dataset: ProgramDataSet | number, delayChange: boolean = false): boolean
  {
    const index = isNumber(dataset)
      ? dataset
      : this.datasets.indexOf(dataset);
    const exists = index >= 0 && index < this.datasets.length;

    if (exists)
    {
      const removed = this.datasets[index];
      
      this.trigger('removeDataset', this, removed);

      if (!delayChange)
      {
        this.changed();
      }
    }

    return exists;
  }

  public refactor(transform: Expression, runtime: Runtime)
  {
    const cmd = runtime.getCommand(transform);

    this.datasets.forEach((dataset) => 
    {
      dataset.data = cmd({ value: dataset.data });
    });

    this.changed();
  }
  
}