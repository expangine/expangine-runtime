
import { isUndefined, objectMap } from '../../fns';
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
import { UpdateExpression } from '../../exprs/Update';
import { InvokeExpression } from '../../exprs/Invoke';



export default (run: Runtime) => 
{

  run.setExpression(ConstantExpression, (expr, _thisRun) => 
  {
    return () => expr.value
  });

  run.setExpression(GetExpression, (expr, thisRun) => 
  {
    const parts: Command[] = expr.path.map(sub => thisRun.getCommand(sub));

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

  run.setExpression(SetExpression, (expr, thisRun) => 
  {
    const parts: Command[] = expr.path.map(sub => thisRun.getCommand(sub));
    const last = parts.length - 1;
    const getValue = thisRun.getCommand(expr.value);

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

  run.setExpression(UpdateExpression, (expr, thisRun) => 
  {
    const parts: Command[] = expr.path.map(sub => thisRun.getCommand(sub));
    const last = parts.length - 1;
    const getValue = thisRun.getCommand(expr.value);

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
        const popCurrent = context[expr.currentVariable];

        context[expr.currentVariable] = value[dest];
        
        value[dest] = getValue(context);

        context[expr.currentVariable] = popCurrent;

        return true;
      }

      return false;
    };
  });

  run.setExpression(OperationExpression, (expr, thisRun) => 
  {
    const params = objectMap(expr.params, e => thisRun.getCommand(e));
    const op = run.getOperation(expr.name);

    if (!op) 
    { 
      throw new Error(`Operation with ${expr.name} is not defined in the given runtime.`);
    }
    
    const defaults = run.getOperationScopeDefaults(expr.name);
    let scopeAlias = expr.scopeAlias;

    if (defaults) 
    {
      for (const prop in defaults) 
      {
        if (!(prop in scopeAlias)) 
        { 
          if (scopeAlias === expr.scopeAlias) 
          {
            scopeAlias = { ...scopeAlias };
          }

          scopeAlias[prop] = defaults[prop];
        }
      }
    }

    return op(params, scopeAlias);
  });

  run.setExpression(InvokeExpression, (expr, thisRun) =>
  {
    const func = thisRun.getFunction(expr.name);
    const command = thisRun.getCommand(func.options.expression);
    const args = objectMap(expr.args, a => thisRun.getCommand(a));

    return (context) => command(objectMap(args, a => a(context)));
  });

  run.setExpression(ChainExpression, (expr, thisRun) => 
  { 
    const chain = expr.chain.map(data => thisRun.getCommand(data));

    return (context) => chain.reduce<any>((_, cmd) => cmd(context), undefined)
  });

  run.setExpression(IfExpression, (expr, thisRun) => 
  {
    const cases = expr.cases.map(([test, result]) => [thisRun.getCommand(test), thisRun.getCommand(result)]);
    const otherwise = thisRun.getCommand(expr.otherwise);

    return (context) => 
    {
      for (const caseExpression of cases)
      {
        const [test, result] = caseExpression;

        if (test(context)) 
        {
          return result(context);
        }
      }

      return otherwise(context);
    };
  });

  run.setExpression(SwitchExpression, (expr, thisRun) => 
  {
    const valueCommand = thisRun.getCommand(expr.value);
    const cases: [Command[], Command][] = expr.cases.map(([tests, result]) => [
      tests.map(t => thisRun.getCommand(t)),
      thisRun.getCommand(result)
    ]);
    const defaultCase = thisRun.getCommand(expr.defaultCase);
    const isEqual = thisRun.getOperation(expr.op);
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

  run.setExpression(NotExpression, (expr, thisRun) => 
  {
    const expression = thisRun.getCommand(expr.expression);

    return (context) => !expression(context);
  });

  run.setExpression(AndExpression, (expr, thisRun) => 
  {
    const expressions = expr.expressions.map(e => thisRun.getCommand(e));
    const defaultResult = expressions.length > 0;

    return (context) => 
    {
      for (const and of expressions)
      {
        if (!and(context))
        {
          return false;
        }
      }

      return defaultResult;
    };
  });

  run.setExpression(OrExpression, (expr, thisRun) => 
  {
    const expressions = expr.expressions.map(e => thisRun.getCommand(e));
    const defaultResult = expressions.length === 0;

    return (context) => 
    {
      for (const or of expressions)
      {
        if (or(context))
        {
          return true;
        }
      }

      return defaultResult;
    };
  });

  run.setExpression(ForExpression, (expr, thisRun) => 
  {
    const variable = expr.variable;
    const start = thisRun.getCommand(expr.start);
    const end = thisRun.getCommand(expr.end);
    const body = thisRun.getCommand(expr.body);
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
      let last;
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

  run.setExpression(WhileExpression, (expr, thisRun) => 
  {
    const condition = thisRun.getCommand(expr.condition);
    const body = thisRun.getCommand(expr.body);
    const breakVariable = expr.breakVariable;
    const max = expr.maxIterations;

    return (context) => 
    {
      let iterations = 0;
      let last;

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

  run.setExpression(DoExpression, (expr, thisRun) => 
  {
    const condition = thisRun.getCommand(expr.condition);
    const body = thisRun.getCommand(expr.body);
    const breakVariable = expr.breakVariable;
    const max = expr.maxIterations;

    return (context) => 
    {
      let iterations = 0;
      let last;

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

  run.setExpression(DefineExpression, (expr, thisRun) => 
  {
    const define = objectMap(expr.define, e => thisRun.getCommand(e));
    const body = thisRun.getCommand(expr.body);

    return (context) =>
    {
      const pop = {};

      for (const prop in define) 
      {
        pop[prop] = context[prop];
      }

      for (const prop in define) 
      {
        context[prop] = define[prop](context);
      }

      const result = body(context)

      for (const prop in define) 
      {
        context[prop] = pop[prop];
      }

      return result;
    };
  });

  run.setExpression(TemplateExpression, (expr, thisRun) => 
  {
    const SECTION_TYPES = 2;
    const SECTION_INDEX_CONSTANT = 0;

    const params = objectMap(expr.params, e => thisRun.getCommand(e));
    const template = expr.template;

    const sections = template.split(/[\{\}]/).map((section, index) => {
      return index % SECTION_TYPES === SECTION_INDEX_CONSTANT
        ? (_source: any) => section
        : (source: any) => source && section in source ? source[section] : '';
    });

    return (context) =>
    {
      const source = objectMap(params, p => p(context));

      return sections.reduce((out, section) => out + section(source), '');
    };
  });

};