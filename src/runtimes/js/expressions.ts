
import { isUndefined, mapObject } from '../../fns';
import { Runtime } from '../../Runtime';
import { Command } from '../../Command';

import { ConstantExpression } from '../../exprs/Constant';
import { GetExpression } from '../../exprs/Get';
import { OperationExpression } from '../../exprs/Operation';
import { ChainExpression } from '../../exprs/Chain';
import { IfExpression } from '../../exprs/If';
import { NotExpression } from '../../exprs/Not';
import { AndExpression } from '../../exprs/And';
import { OrExpression } from '../../exprs/Or';
import { ForExpression } from '../../exprs/For';
import { WhileExpression } from '../../exprs/While';
import { DefineExpression } from '../../exprs/Define';
import { SwitchExpression } from '../../exprs/Switch';
import { SetExpression } from '../../exprs/Set';
import { DoExpression } from '../../exprs/Do';
import { TemplateExpression } from '../../exprs/Template';



export default (run: Runtime) => 
{

  run.setExpression(ConstantExpression, (expr, run) => 
  {
    return () => expr.value
  });

  run.setExpression(GetExpression, (expr, run) => 
  {
    const parts: Command[] = expr.path.map(sub => run.getCommand(sub));

    return (context) => 
    {
      let value: any = context;

      for (let i = 0; i < parts.length && !isUndefined(value); i++) 
      {
        const next = parts[i](context);

        if (isUndefined(value[next])) 
        {
          return undefined;
        }

        value = value[next];
      }
      
      return value;
    };
  });

  run.setExpression(SetExpression, (expr, run) => 
  {
    const parts: Command[] = expr.path.map(sub => run.getCommand(sub));
    const last = parts.length - 1;
    const getValue = run.getCommand(expr.value);

    return (context) => 
    {
      let value: any = context;

      for (let i = 0; i < last && !isUndefined(value); i++) 
      {
        const next = parts[i](context);

        if (isUndefined(value[next])) 
        {
          return false;
        }

        value = value[next];
      }

      if (!isUndefined(value)) 
      {
        const dest = parts[last](context);
        value[dest] = getValue(context);

        return true;
      }

      return false;
    };
  });

  run.setExpression(OperationExpression, (expr, run) => 
  {
    const params = mapObject(expr.params, expr => run.getCommand(expr));
    const op = run.getOperation(expr.name);

    if (!op) {
      throw new Error(`Operation with ${expr.name} is not defined in the given runtime.`);
    }
    
    const defaults = run.getOperationScopeDefaults(expr.name);
    let scopeAlias = expr.scopeAlias;

    if (defaults) {
      for (let prop in defaults) {
        if (!(prop in scopeAlias)) {
          if (scopeAlias === expr.scopeAlias) {
            scopeAlias = { ...scopeAlias };
          }
          scopeAlias[prop] = defaults[prop];
        }
      }
    }

    return op(params, scopeAlias);
  });

  run.setExpression(ChainExpression, (expr, run) => 
  { 
    const chain = expr.chain.map(data => run.getCommand(data));

    return (context) => chain.reduce<any>((_, cmd) => cmd(context), undefined)
  });

  run.setExpression(IfExpression, (expr, run) => 
  {
    const cases = expr.cases.map(([test, result]) => [run.getCommand(test), run.getCommand(result)]);
    const otherwise = run.getCommand(expr.otherwise);

    return (context) => 
    {
      for (let i = 0; i < cases.length; i++) 
      {
        const [test, result] = cases[i];

        if (test(context)) 
        {
          return result(context);
        }
      }

      return otherwise(context);
    };
  });

  run.setExpression(SwitchExpression, (expr, run) => 
  {
    const valueCommand = run.getCommand(expr.value);
    const cases: [Command[], Command][] = expr.cases.map(([tests, result]) => [
      tests.map(t => run.getCommand(t)),
      run.getCommand(result)
    ]);
    const defaultCase = run.getCommand(expr.defaultCase);
    const isEqual = run.getOperation(expr.op);
    const noScope = {};
    
    return (context) => 
    {
      const value = valueCommand(context);

      for (const [tests, result] of cases)
      {
        let matches = false;

        for (const testCommand of tests) 
        { 
          const test = testCommand(context);

          if (isEqual({ value, test }, noScope)(context)) 
          {
            matches = true;
            break;
          }
        }

        if (matches) 
        {
          return result(context);
        }
      }

      return defaultCase(context);
    };
  });

  run.setExpression(NotExpression, (expr, run) => 
  {
    const expression = run.getCommand(expr.expression);

    return (context) => !expression(context);
  });

  run.setExpression(AndExpression, (expr, run) => 
  {
    const expressions = expr.expressions.map(expr => run.getCommand(expr));
    const defaultResult = expressions.length > 0;

    return (context) => 
    {
      for (let i = 0; i < expressions.length; i++)
      {
        if (!expressions[i](context))
        {
          return false;
        }
      }

      return defaultResult;
    };
  });

  run.setExpression(OrExpression, (expr, run) => 
  {
    const expressions = expr.expressions.map(expr => run.getCommand(expr));
    const defaultResult = expressions.length === 0;

    return (context) => 
    {
      for (let i = 0; i < expressions.length; i++)
      {
        if (expressions[i](context))
        {
          return true;
        }
      }

      return defaultResult;
    };
  });

  run.setExpression(ForExpression, (expr, run) => 
  {
    const variable = expr.variable;
    const start = run.getCommand(expr.start);
    const end = run.getCommand(expr.end);
    const body = run.getCommand(expr.body);
    const breakVariable = expr.breakVariable;
    const max = expr.maxIterations;

    return (context) => 
    {
      const popVariable = context[variable];
      const popBreak = context[breakVariable];

      context[breakVariable] = false;

      let i = start(context);
      let iterations = 0;
      let stop = end(context);
      let last = undefined;
      const dir = i < stop ? 1 : -1;

      while ((dir === 1 ? i <= stop : i >= stop) && iterations++ < max) 
      {
        context[variable] = i;
        last = body(context);

        if (context[breakVariable]) {
          break;
        }

        i += dir;
        stop = end(context);
      }

      context[variable] = popVariable;
      context[breakVariable] = popBreak;

      return last;
    };
  });

  run.setExpression(WhileExpression, (expr, run) => 
  {
    const condition = run.getCommand(expr.condition);
    const body = run.getCommand(expr.body);
    const breakVariable = expr.breakVariable;
    const max = expr.maxIterations;

    return (context) => 
    {
      let iterations = 0;
      let last = undefined;

      const popBreak = context[breakVariable];

      context[breakVariable] = false;

      while (condition(context) && iterations++ < max)
      {
        last = body(context);

        if (context[breakVariable]) {
          break;
        }
      }

      context[breakVariable] = popBreak;

      return last;
    };
  });

  run.setExpression(DoExpression, (expr, run) => 
  {
    const condition = run.getCommand(expr.condition);
    const body = run.getCommand(expr.body);
    const breakVariable = expr.breakVariable;
    const max = expr.maxIterations;

    return (context) => 
    {
      let iterations = 0;
      let last = undefined;

      const popBreak = context[breakVariable];

      context[breakVariable] = false;

      do
      {
        last = body(context);

        if (context[breakVariable]) {
          break;
        }

      } while(condition(context) && iterations++ < max);

      context[breakVariable] = popBreak;

      return last;
    };
  });

  run.setExpression(DefineExpression, (expr, run) => 
  {
    const define = mapObject(expr.define, e => run.getCommand(e));
    const body = run.getCommand(expr.body);

    return (context) =>
    {
      const pop = {};

      for (let prop in define) {
        pop[prop] = context[prop];
      }

      for (let prop in define) {
        context[prop] = define[prop](context);
      }

      const result = body(context)

      for (let prop in define) {
        context[prop] = pop[prop];
      }

      return result;
    };
  });

  run.setExpression(TemplateExpression, (expr, run) => 
  {
    const params = mapObject(expr.params, e => run.getCommand(e));
    const template = expr.template;

    const sections = template.split(/[\{\}]/).map((section, index) => {
      return index % 2 === 0
        ? (_source: any) => section
        : (source: any) => source && section in source ? source[section] : '';
    });

    return (context) =>
    {
      const source = mapObject(params, p => p(context));

      return sections.reduce((out, section) => out + section(source), '');
    };
  });

};