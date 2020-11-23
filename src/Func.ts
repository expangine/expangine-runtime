import { Type, TypeMap } from './Type';
import { Expression } from './Expression';
import { Definitions } from './Definitions';
import { Types } from './Types';
import { Exprs } from './Exprs';
import { arraySync, isNumber, now } from './fns';
import { Runtime } from './Runtime';
import { DefinitionProvider } from './DefinitionProvider';
import { DataTypes } from './DataTypes';
import { EventBase } from './EventBase';
import { FunctionType } from './types/Function';
import { FlowExpression } from './exprs/Flow';
import { Traverser } from './Traverser';
import { FlowType } from './FlowType';


export interface FuncOptions
{
  name: string;
  created: number;
  updated: number;
  description: string;
  meta: any;
  type: any;
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
      type: Types.func(defs, {}, Types.null()),
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
  public type: FunctionType;
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
    this.type = defs.getTypeKind(options.type, FunctionType, FunctionType.baseType);
    this.expression = this.parseExpression(defs, options.expression);
    this.defaults = this.type.fromJsonArguments(options.defaults);
    this.tests = options.tests.map((t) => ({ ...t, args: this.type.fromJsonArguments(t.args) }));
  }

  protected parseExpression(defs: Definitions, expr: any): Expression
  {
    let e = defs.getExpression(expr);

    if (!e.traverse(Traverser.some((c) => c instanceof FlowExpression && c.type === FlowType.RETURN))) 
    {
      e = new FlowExpression(FlowType.RETURN, e);
    }

    return e;
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
      this.type = options instanceof Func
        ? options.type
        : defs.getTypeKind(options.type, FunctionType, FunctionType.baseType);
      this.expression = options instanceof Func
        ? options.expression
        : this.parseExpression(defs, options.expression);
      this.defaults = options instanceof Func
        ? options.defaults
        : this.type.fromJsonArguments(options.defaults);

      arraySync(
        this.tests, 
        options instanceof Func
          ? options.tests
          : options.tests.map((t) => ({ ...t, args: this.type.fromJsonArguments(t.args) })),
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
    const { name, created, updated, description, meta, type, expression, defaults, tests } = this;

    return {
      name,
      created,
      updated,
      description, 
      meta,
      type: type.encode(),
      expression: expression.encode(),
      defaults: type.toJsonArguments(defaults),
      tests: tests.map((t) => ({ ...t, args: type.toJsonArguments(t.args) })),
    };
  }

  public renameParameter(name: string, newName: string): boolean
  {
    const params = this.type.options.params;
    const paramType = params[name];

    if (paramType)
    {
      DataTypes.objectSet(params, newName, paramType);
      DataTypes.objectRemove(params, name);

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
    const params = this.type.options.params;
    const exists = name in params;

    if (exists)
    {
      DataTypes.objectRemove(params, name);
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

  public getReturnType(defs: DefinitionProvider, context: Type, paramsTypes: TypeMap = {}) 
  {
    return this.type.getOverloaded(paramsTypes).getReturnType() || this.expression.getType(defs, context);
  }

  public getParamTypes(): TypeMap
  {
    return this.type.getParamTypes();
  }

  public getParamType(param: string): Type | undefined
  {
    const paramType = this.type.getParamType(param);

    return paramType
      ? paramType.isOptional() && 
        param in this.defaults && 
        paramType.isValid(this.defaults[param])
        ? paramType.getRequired()
        : paramType
      : undefined;
  }

  public getArguments(args: any, returnNew: boolean = true)
  {
    const target = returnNew ? { ...args } : args;

    for (const prop in this.defaults)
    {
      const propType = this.type.getParamType(prop);

      if (propType && !propType.getRequired().isValid(target[prop]))
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

  public mutates(def: DefinitionProvider, arg: string): boolean
  {
    if (!(arg in this.type.options.params))
    {
      return false;
    }

    return this.expression.mutates(def, arg, false);
  }

}