
import { isUndefined, objectMap } from '../../fns';
import { restoreScope, preserveScope } from './helper';

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
import { ReturnExpression } from '../../exprs/Return';
import { NoExpression } from '../../exprs/No';


import { runtime as run, LiveCommand, LiveCommandMap } from '.';


run.setExpression(ConstantExpression, (expr, _thisRun) => 
{
  return () => expr.value
});

run.setExpression(GetExpression, (expr, thisRun) => 
{
  const parts: LiveCommand[] = expr.path.map(sub => thisRun.getCommand(sub));

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
  const parts: LiveCommand[] = expr.path.map(sub => thisRun.getCommand(sub));
  const last: number = parts.length - 1;
  const getValue: LiveCommand = thisRun.getCommand(expr.value);

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
  const parts: LiveCommand[] = expr.path.map(sub => thisRun.getCommand(sub));
  const last: number = parts.length - 1;
  const getValue: LiveCommand = thisRun.getCommand(expr.value);
  const currentVariable: string = expr.currentVariable;

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

      preserveScope(context, [currentVariable], () => 
      {
        context[currentVariable] = value[dest];
      
        value[dest] = getValue(context);
      });

      return true;
    }

    return false;
  };
});

run.setExpression(OperationExpression, (expr, thisRun) => 
{
  const params: LiveCommandMap = objectMap(expr.params, e => thisRun.getCommand(e));
  const op = thisRun.getOperation(expr.name);

  if (!op) 
  { 
    throw new Error(`Operation with ${expr.name} is not defined in the given runtime.`);
  }
  
  const defaults = thisRun.getOperationScopeDefaults(expr.name);
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

  const operationCommand = op(params, scopeAlias);

  return (context) =>
  {
    if (thisRun.returnProperty in context) return;

    return operationCommand(context);
  };
});

run.setExpression(ChainExpression, (expr, thisRun) => 
{ 
  const chain: LiveCommand[] = expr.chain.map(data => thisRun.getCommand(data));

  return (context) => 
  {
    if (thisRun.returnProperty in context) return;

    let last;

    for (const cmd of chain)
    {
      last = cmd(context);

      if (thisRun.returnProperty in context)
      {
        return;
      }
    }

    return last;
  };
});

run.setExpression(IfExpression, (expr, thisRun) => 
{
  const cases: [LiveCommand, LiveCommand][] = expr.cases.map(([test, result]) => [thisRun.getCommand(test), thisRun.getCommand(result)]);
  const otherwise: LiveCommand = thisRun.getCommand(expr.otherwise);

  return (context) => 
  {
    if (thisRun.returnProperty in context) return;

    for (const caseExpression of cases)
    {
      const [test, result] = caseExpression;

      if (test(context)) 
      {
        return thisRun.returnProperty in context
          ? undefined
          : result(context);
      }
    }
    
    if (thisRun.returnProperty in context) return;

    return otherwise(context);
  };
});

run.setExpression(SwitchExpression, (expr, thisRun) => 
{
  const valueCommand: LiveCommand = thisRun.getCommand(expr.value);
  const cases: [LiveCommand[], LiveCommand][] = expr.cases.map(([tests, result]) => [
    tests.map(t => thisRun.getCommand(t)),
    thisRun.getCommand(result)
  ]);
  const defaultCase: LiveCommand = thisRun.getCommand(expr.defaultCase);
  const isEqual = thisRun.getOperation(expr.op);
  const noScope = {};
  
  return (context) => 
  {
    if (thisRun.returnProperty in context) return;

    const value = valueCommand(context);

    if (thisRun.returnProperty in context) return;

    for (const [tests, result] of cases)
    {
      let matches = false;

      for (const test of tests) 
      { 
        if (isEqual({ value: () => value, test }, noScope)(context)) 
        {
          matches = true;
          break;
        }

        if (thisRun.returnProperty in context) return;
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
  const expression: LiveCommand = thisRun.getCommand(expr.expression);

  return (context) => !expression(context);
});

run.setExpression(AndExpression, (expr, thisRun) => 
{
  const expressions: LiveCommand[] = expr.expressions.map(e => thisRun.getCommand(e));
  const defaultResult: boolean = expressions.length > 0;

  return (context) => 
  {
    if (thisRun.returnProperty in context) return;

    for (const and of expressions)
    {
      if (!and(context) || thisRun.returnProperty in context)
      {
        return false;
      }
    }

    return defaultResult;
  };
});

run.setExpression(OrExpression, (expr, thisRun) => 
{
  const expressions: LiveCommand[] = expr.expressions.map(e => thisRun.getCommand(e));
  const defaultResult: boolean = expressions.length === 0;

  return (context) => 
  {
    if (thisRun.returnProperty in context) return;

    for (const or of expressions)
    {
      if (or(context) || thisRun.returnProperty in context)
      {
        return true;
      }
    }

    return defaultResult;
  };
});

run.setExpression(ForExpression, (expr, thisRun) => 
{
  const variable: string = expr.variable;
  const start: LiveCommand = thisRun.getCommand(expr.start);
  const end: LiveCommand = thisRun.getCommand(expr.end);
  const body: LiveCommand = thisRun.getCommand(expr.body);
  const breakVariable: string = expr.breakVariable;
  const max: number = expr.maxIterations;

  return (context) => 
  {
    if (thisRun.returnProperty in context) return;

    return preserveScope(context, [variable, breakVariable], () => 
    {
      context[breakVariable] = false;

      let i = start(context);
      let iterations = 0;
      let stop = end(context);
      let last;
      const dir = i < stop ? 1 : -1;

      if (thisRun.returnProperty in context)
      {
        return;
      }

      while ((dir === 1 ? i <= stop : i >= stop) && iterations++ < max) 
      {
        context[variable] = i;
        last = body(context);

        if (context[breakVariable] || thisRun.returnProperty in context) 
        {
          break;
        }

        i += dir;
        stop = end(context);

        if (thisRun.returnProperty in context) return;
      }

      return last;
    });
  };
});

run.setExpression(WhileExpression, (expr, thisRun) => 
{
  const condition: LiveCommand = thisRun.getCommand(expr.condition);
  const body: LiveCommand = thisRun.getCommand(expr.body);
  const breakVariable: string = expr.breakVariable;
  const max: number = expr.maxIterations;

  return (context) => 
  {
    if (thisRun.returnProperty in context) return;

    return preserveScope(context, [breakVariable], () =>
    {
      let iterations = 0;
      let last;

      context[breakVariable] = false;

      while (condition(context) && iterations++ < max)
      {
        if (thisRun.returnProperty in context) return;

        last = body(context);

        if (context[breakVariable] || thisRun.returnProperty in context) 
        {
          break;
        }
      }

      return last;
    });
  };
});

run.setExpression(DoExpression, (expr, thisRun) => 
{
  const condition: LiveCommand = thisRun.getCommand(expr.condition);
  const body: LiveCommand = thisRun.getCommand(expr.body);
  const breakVariable: string = expr.breakVariable;
  const max: number = expr.maxIterations;

  return (context) => 
  {
    if (thisRun.returnProperty in context) return;

    return preserveScope(context, [breakVariable], () =>
    {
      let iterations = 0;
      let last;

      context[breakVariable] = false;

      do
      {
        if (thisRun.returnProperty in context) return;

        last = body(context);

        if (context[breakVariable] || thisRun.returnProperty in context) 
        {
          break;
        }

      } while(condition(context) && iterations++ < max);

      return last;
    });
  };
});

run.setExpression(DefineExpression, (expr, thisRun) => 
{
  const define: LiveCommandMap = objectMap(expr.define, e => thisRun.getCommand(e));
  const body: LiveCommand = thisRun.getCommand(expr.body);

  return (context) =>
  {
    if (thisRun.returnProperty in context) return;

    const pop = {};

    for (const prop in define) 
    {
      pop[prop] = context[prop];
    }

    for (const prop in define) 
    {
      context[prop] = define[prop](context);

      if (thisRun.returnProperty in context)
      {
        restoreScope(context, pop);

        return;
      }
    }

    const result = body(context);

    restoreScope(context, pop);

    return result;
  };
});

run.setExpression(TemplateExpression, (expr, thisRun) => 
{
  const SECTION_TYPES = 2;
  const SECTION_INDEX_CONSTANT = 0;

  const params: LiveCommandMap = objectMap(expr.params, e => thisRun.getCommand(e));
  const template: string = expr.template;

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

run.setExpression(InvokeExpression, (expr, thisRun) =>
{
  const func = thisRun.getFunction(expr.name);
  const command = thisRun.getCommand(func.options.expression);
  const args = objectMap(expr.args, a => thisRun.getCommand(a));

  return (context) => 
  {
    if (thisRun.returnProperty in context) return;

    const params = objectMap(args, a => a(context));

    command(params);

    return params[thisRun.returnProperty];
  };
});

run.setExpression(ReturnExpression, (expr, thisRun) =>
{
  const returnValue = thisRun.getCommand(expr.value);

  return (context) => context[thisRun.returnProperty] = returnValue(context);
});

run.setExpression(NoExpression, () => () => undefined);
