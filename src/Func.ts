import { ObjectType, ObjectOptions } from './types/Object';
import { TypeMap } from './Type';
import { Expression } from './Expression';
import { Definitions } from './Definitions';
import { Types } from './Types';
import { Exprs } from './Exprs';
import { isEmpty, objectMap, copy } from './fns';
import { Runtime } from './Runtime';
import { DefinitionProvider } from './DefinitionProvider';


export interface FuncOptions
{
  name: string;
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

export class Func
{

  public static create(defs: Definitions, defaults: Partial<FuncOptions> = {}) {
    return new Func({
      name: '',
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
  public description: string;
  public meta: any;
  public params: ObjectType<ObjectOptions>;
  public expression: Expression;
  public defaults: any;
  public tests: FuncTest[];

  public constructor(options: FuncOptions, defs: Definitions) 
  {
    this.name = options.name;
    this.description = options.description;
    this.meta = options.meta;
    this.params = defs.getTypeKind(options.params, ObjectType, Types.object());
    this.expression = defs.getExpression(options.expression);
    this.defaults = this.params.fromJson(options.defaults);
    this.tests = options.tests.map((t) => ({ ...t, args: this.params.fromJson(t.args) }));
  }

  public encode(): FuncOptions 
  {
    const { name, description, meta, params, expression, defaults, tests } = this;

    return {
      name,
      description, 
      meta,
      params: params.encode(),
      expression: expression.encode(),
      defaults: params.toJson(defaults),
      tests: tests.map((t) => ({ ...t, args: params.toJson(t.args) })),
    };
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
        target[prop] = copy(this.defaults[prop]);
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
  }

}