import { ObjectType, ObjectOptions } from './types/Object';
import { TypeMap } from './Type';
import { Expression } from './Expression';
import { Definitions } from './Definitions';
import { Types } from './Types';
import { Exprs } from './Exprs';
import { isEmpty, objectMap, arraySync, isNumber, now } from './fns';
import { Runtime } from './Runtime';
import { DefinitionProvider } from './DefinitionProvider';
import { DataTypes } from './DataTypes';
import { EventBase } from './EventBase';


export interface FuncOptions
{
  name: string;
  created: number;
  updated: number;
  description: string;
  meta: any;
  params: any;
  expression: any;
  defaults: any;
  tests: FuncTest[];
}

export interface FuncTest
{
  name: string;
  description: string;
  args: any;
  expected: any;
}

export interface FuncEvents
{
  changed(func: Func): void;
  renamed(func: Func, oldName: string): void;
  renameParameter(func: Func, param: string, oldParam: string): void;
  removeParameter(func: Func, param: string): void;
  sync(func: Func, options: FuncOptions, defs: Definitions): void;
  addTest(func: Func, test: FuncTest): void;
  removeTest(func: Func, test: FuncTest): void;
  updateTest(func: Func, test: FuncTest): void;
}

export class Func extends EventBase<FuncEvents> implements FuncOptions
{

  public static create(defs: Definitions, defaults: Partial<FuncOptions> = {}) {
    return new Func({
      name: '',
      created: now(),
      updated: now(),
      description: '',
      meta: null,
      params: Types.object(),
      expression: Exprs.noop(),
      defaults: {},
      tests: [],
      ...defaults,
    }, defs);
  }

  public name: string;
  public created: number;
  public updated: number;
  public description: string;
  public meta: any;
  public params: ObjectType<ObjectOptions>;
  public expression: Expression;
  public defaults: any;
  public tests: FuncTest[];

  public constructor(options: FuncOptions, defs: Definitions) 
  {
    super();

    this.name = options.name;
    this.created = options.created || now();
    this.updated = options.updated || now();
    this.description = options.description;
    this.meta = options.meta;
    this.params = defs.getTypeKind(options.params, ObjectType, Types.object());
    this.expression = defs.getExpression(options.expression);
    this.defaults = this.params.fromJson(options.defaults);
    this.tests = options.tests.map((t) => ({ ...t, args: this.params.fromJson(t.args) }));
  }

  public sync(options: FuncOptions, defs: Definitions)
  {
    if (this.hasChanges(options))
    {
      this.name = options.name;
      this.created = options.created || now();
      this.updated = options.updated || now();
      this.description = options.description;
      this.meta = options.meta;
      this.params = options instanceof Func
        ? options.params
        : defs.getTypeKind(options.params, ObjectType, Types.object());
      this.expression = options instanceof Func
        ? options.expression
        : defs.getExpression(options.expression);
      this.defaults = options instanceof Func
        ? options.defaults
        : this.params.fromJson(options.defaults);

      arraySync(
        this.tests, 
        options instanceof Func
          ? options.tests
          : options.tests.map((t) => ({ ...t, args: this.params.fromJson(t.args) })),
        (a, b) => a.name === b.name || DataTypes.equals(a.args, b.args), 
        (target, value) => this.addTest(value, true),
        (target, index) => this.removeTest(index, true),
        (target, index, value, newValue) => this.updateTest(value, newValue, true),
      );

      this.trigger('sync', this, options, defs);
      this.changed();
    }
  }

  public hasChanges(options: FuncOptions): boolean
  {
    return !DataTypes.equals(options instanceof Func ? options.encode() : options, this.encode());
  }

  public changed()
  {
    this.updated = now();

    this.trigger('changed', this);
  }

  public encode(): FuncOptions 
  {
    const { name, created, updated, description, meta, params, expression, defaults, tests } = this;

    return {
      name,
      created,
      updated,
      description, 
      meta,
      params: params.encode(),
      expression: expression.encode(),
      defaults: params.toJson(defaults),
      tests: tests.map((t) => ({ ...t, args: params.toJson(t.args) })),
    };
  }

  public renameParameter(name: string, newName: string): boolean
  {
    const paramType = this.params.options.props[name];

    if (paramType)
    {
      DataTypes.objectSet(this.params.options.props, newName, paramType);
      DataTypes.objectRemove(this.params.options.props, name);

      if (name in this.defaults)
      {
        DataTypes.objectSet(this.defaults, newName, this.defaults[name]);
        DataTypes.objectRemove(this.defaults, name);
      }

      this.trigger('renameParameter', this, newName, name);
      this.changed();
    }

    return !!paramType;
  }

  public removeParameter(name: string): boolean
  {
    const exists = name in this.params.options.props[name];

    if (exists)
    {
      DataTypes.objectRemove(this.params.options.props, name);
      DataTypes.objectRemove(this.defaults, name);

      this.trigger('removeParameter', this, name);
      this.changed();
    }

    return exists;
  }

  public addTest(test: FuncTest, delayChange: boolean = false)
  {
    this.tests.push(test);

    this.trigger('addTest', this, test);

    if (!delayChange)
    {
      this.changed();
    }
  }

  public updateTest(test: FuncTest | number, newTest: FuncTest, delayChange: boolean = false): boolean
  {
    const target = isNumber(test)
      ? this.tests[test]
      : test;
    const exists = !!target;

    if (exists)
    {
      Object.assign(target, newTest);

      this.trigger('updateTest', this, target);

      if (!delayChange)
      {
        this.changed();
      }
    }

    return exists;
  }

  public removeTest(test: FuncTest | number, delayChange: boolean = false): boolean
  {
    const index = isNumber(test)
      ? test
      : this.tests.indexOf(test);
    const exists = index >= 0 && index < this.tests.length;

    if (exists)
    {
      const removed = this.tests[index];
      
      this.trigger('removeTest', this, removed);

      if (!delayChange)
      {
        this.changed();
      }
    }

    return exists;
  }

  public getReturnType(defs: DefinitionProvider, paramsTypes: TypeMap = {}) 
  {
    const context = Types.object({
      ...this.params.options.props,
      ...paramsTypes,
    });

    return this.expression.getType(defs, context);
  }

  public getParamTypes(): ObjectType
  {
    return isEmpty(this.defaults)
      ? this.params
      : Types.object(objectMap(this.params.options.props, (_, prop) => this.getParamType(prop)));
  }

  public getParamType(param: string)
  {
    const propType = this.params.options.props[param];

    return propType.isOptional() && param in this.defaults && propType.isValid(this.defaults[param])
      ? propType.getRequired()
      : propType;
  }

  public getArguments(args: any, returnNew: boolean = true)
  {
    const target = returnNew ? { ...args } : args;

    for (const prop in this.defaults)
    {
      const propType = this.params.options.props[prop];

      if (!propType.getRequired().isValid(target[prop]))
      {
        DataTypes.objectSet(target, prop, DataTypes.copy(this.defaults[prop]));
      }
    }

    return target;
  }

  public refactor(transform: Expression, runtime: Runtime)
  {
    const cmd = runtime.getCommand(transform);

    this.tests.forEach((test) =>
    {
      test.args = cmd({ value: test.args });
    });

    this.changed();
  }

}