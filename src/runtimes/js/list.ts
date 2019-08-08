
import { Runtime } from '../../Runtime';
import { ListOps } from '../../def/ListOps';
import { array, optional, number, saveScope, restoreScope, text, bool } from './helper';
import { Command } from '../../Command';


// tslint:disable: no-magic-numbers
// tslint:disable: one-variable-per-declaration

export default (run: Runtime) =>
{

  // Operations

  run.setOperation(ListOps.add, (params) => (context) => {
    const list = array(params.list, context);
    const item = optional(params.item, context);
    if (item !== undefined) {
      list.push(item);
    }

    return list;
  });

  run.setOperation(ListOps.addFirst, (params) => (context) => {
    const list = array(params.list, context);
    const item = optional(params.item, context);
    if (item !== undefined) {
      list.unshift(item);
    }

    return list;
  });

  run.setOperation(ListOps.addLast, (params) => (context) => {
    const list = array(params.list, context);
    const item = optional(params.item, context);
    if (item !== undefined) {
      list.push(item);
    }

    return list;
  });

  run.setOperation(ListOps.insert, (params) => (context) => {
    const list = array(params.list, context);
    const item = optional(params.item, context);
    const index = number(params.index, context, 0);
    if (item !== undefined) {
      list.splice(index, 0, item);
    }

    return list;
  });

  run.setOperation(ListOps.remove, (params, scope) => (context) => 
    handleListIsEqual(
      array(params.list, context), 
      context, 
      params, 
      scope, 
      params.item(context), 
      n => 0, 
      n => n, 
      (_, i, list) => (list.splice(i, 1), i), 
      () => -1
    )
  );

  run.setOperation(ListOps.removeFirst, (params, scope) => (context) => 
    array(params.list, context).shift()
  );

  run.setOperation(ListOps.removeLast, (params, scope) => (context) => 
    array(params.list, context).pop()
  );

  run.setOperation(ListOps.removeAt, (params, scope) => (context) => {
    const list = array(params.list, context);
    const index = number(params.index, context, -1);
    let item;
    if (index >= 0 && index < list.length) {
      item = list[index];
      list.splice(index, 1);
    }

    return item;
  });

  run.setOperation(ListOps.contains, (params, scope) => (context) =>
    handleListIsEqual(
      array(params.list, context), 
      context, 
      params, 
      scope, 
      params.item(context), 
      n => 0, 
      n => n,
      () => true, 
      () => false
    )
  );

  run.setOperation(ListOps.copy, (params, scope) => (context) => 
    params.deepCopy
      ? handleList(
          array(params.list, context), 
          context, 
          scope, 
          list => list.map(item => {
            context[scope.copy] = item;
            
            return params.deepCopy(context);
          })
        )
      : array(params.list, context).slice()
  );

  run.setOperation(ListOps.reverse, (params) => (context) => {
    const list = array(params.list, context);
    const half = Math.floor(list.length / 2); 
    
    for (let i = 0, j = list.length - 1; i < half; i++, j--) { 
      swap(list, i, j);
    }
    
    return list;
  });

  run.setOperation(ListOps.exclude, (params, scope) => (context) => {
    const list = array(params.list, context);
    const exclude = array(params.exclude, context);

    for (const item of exclude) 
    {
      handleListIsEqual(list, context, params, scope, item, n => 0, n => n, (_, k) => (list.splice(k, 1), true), () => false);
    }

    return list;
  });

  run.setOperation(ListOps.overlap, (params, scope) => (context) => {
    const list = array(params.list, context);
    const overlap = array(params.overlap, context);
    const overlapping: any[] = [];

    for (const item of overlap) 
    {
      if (handleListIsEqual(list, context, params, scope, item, n => 0, n => n, () => true, () => false))
      {
        overlapping.push(item)
      }
    }

    return overlapping;
  });

  run.setOperation(ListOps.sort, (params, scope) => (context) =>
    handleList(
      array(params.list, context), 
      context, 
      scope, 
      list => {
        list.sort((value, test) => {
          context[scope.list] = list;
          context[scope.value] = value;
          context[scope.test] = test;

          return number(params.compare, context, 0);
        });

        return list;
      }
    )
  );

  run.setOperation(ListOps.shuffle, (params) => (context) => {
    const list = array(params.list, context);
    let times = number(params.times, context, 1);
    const n = list.length;

    while (--times >= 0) {
      for (let i = 0; i < n; i++) {
        swap(list, i, Math.floor(Math.random() * n));
      }
    }

    return list;
  });

  run.setOperation(ListOps.unique, (params, scope) => (context) => {
    const list = array(params.list, context);
    const skip = {};
    const unique = [];

    for (let i = 0; i < list.length - 1; i++) {
      if (skip[i]) {
        continue;
      }

      const item = list[i];
      const exists = handleListIsEqual(list, context, params, scope, item, n => i + 1, n => n, (_, k) => skip[k] = true, () => false);

      if (!exists) {
        unique.push(item);
      }
    }

    return unique;
  });

  run.setOperation(ListOps.duplicates, (params, scope) => (context) => {
    const list = array(params.list, context);
    const once = bool(params.once, context, false);
    const skip = {};
    const duplicates = [];

    for (let i = 0; i < list.length; i++) {

      const item = list[i];

      if (skip[i]) {
        if (once) {
          continue;
        } else {
          duplicates.push(item);
        }
      }
      
      const exists = handleListIsEqual(list, context, params, scope, item, n => i + 1, n => n, (_, k) => skip[k] = true, () => false);

      if (exists) {
        duplicates.push(item);
      }
    }

    return duplicates;
  });

  run.setOperation(ListOps.take, (params) => (context) => 
    array(params.list, context).slice(0, number(params.count, context))
  );

  run.setOperation(ListOps.skip, (params) => (context) => 
    array(params.list, context).slice(number(params.count, context))
  );

  run.setOperation(ListOps.drop, (params) => (context) => {
    const list = array(params.list, context);
    const count = number(params.count, context);

    return list.slice(0, list.length - count);
  });

  run.setOperation(ListOps.append, (params) => (context) => {
    const list = array(params.list, context);
    const append = array(params.append, context);

    return list.concat(append);
  });

  run.setOperation(ListOps.prepend, (params) => (context) => {
    const list = array(params.list, context);
    const prepend = array(params.prepend, context);

    return prepend.concat(list);
  });

  run.setOperation(ListOps.indexOf, (params, scope) => (context) =>
    handleListIsEqual(
      array(params.list, context), 
      context, 
      params, 
      scope, 
      params.item(context), 
      n => Math.max(0, Math.min(n, number(params.start, context, 0))), 
      n => n, 
      (_, i) => i, 
      () => -1
    )
  );

  run.setOperation(ListOps.lastIndexOf, (params, scope) => (context) =>
    handleListIsEqual(
      array(params.list, context),
      context, 
      params, 
      scope, 
      params.item(context), 
      n => Math.max(0, Math.min(n - 1, number(params.start, context, n - 1))), 
      n => -1, 
      (_, i) => i, 
      () => -1
    )
  );

  run.setOperation(ListOps.last, (params) => (context) => {
    const list = array(params.list, context);

    return list[list.length - 1];
  });

  run.setOperation(ListOps.first, (params) => (context) => 
    array(params.list, context)[0]
  );

  run.setOperation(ListOps.count, (params) => (context) =>
    array(params.list, context).length
  );

  run.setOperation(ListOps.randomList, (params) => (context) => {
    const list = array(params.list, context);
    const n = list.length;
    const count = Math.min(number(params.count, context, 0), n);

    if (count === n)
    {
      return list.slice();
    }

    const taken = {};
    const random = [];

    while (random.length < count)
    {
      const i = Math.floor(Math.random() * n);

      if (!taken[i])
      {
        random.push(list[i]);
        taken[i] = true;
      }
    }

    return random;
  });

  run.setOperation(ListOps.random, (params) => (context) => {
    const list = array(params.list, context);

    return list[Math.floor(Math.random() * list.length)];
  });

  // Iteration

  run.setOperation(ListOps.join, (params, scope) => (context) =>
    text(params.prefix, context) + 
    handleListIteration(
      array(params.list, context), 
      context, 
      scope, 
      n => 0, 
      n => n,
      '',
      (item, _index, _list, sum) => (
        sum
          ? sum 
            + text(params.delimiter, context, ', ') 
            + text(params.toText, context, item)
          : sum
            + text(params.toText, context, item)
      )
    ) +
    text(params.suffix, context)
  );

  run.setOperation(ListOps.each, (params, scope) => (context) => {
    const list = array(params.list, context);
    const reverse = bool(params.reverse, context, false);

    handleListIteration(list, context, scope, 
      n => reverse ? n - 1 : 0, 
      n => reverse ? 0 - 1 : n, 
      undefined,
      (_item, _index, _list) => params.each(context)
    );

    return list;
  });

  run.setOperation(ListOps.filter, (params, scope) => (context) =>
    handleListIteration(
      array(params.list, context),
      context, 
      scope, 
      n => 0, 
      n => n, 
      [],
      (item, _index, _list, matches) => {
        if (params.filter(context)) {
          matches.push(item);
        }
        
        return matches;
      }
    )
  );

  run.setOperation(ListOps.not, (params, scope) => (context) =>
    handleListIteration(
      array(params.list, context), 
      context, 
      scope, 
      n => 0, 
      n => n, 
      [],
      (item, _index, _list, matches) => {
        if (!params.not(context)) {
          matches.push(item);
        }
        
        return matches;
      }
    )
  );

  run.setOperation(ListOps.map, (params, scope) => (context) => 
    handleListIteration(
      array(params.list, context), 
      context, 
      scope, 
      n => 0, 
      n => n, 
      [],
      (_item, _index, _list, mapped) => {
        mapped.push(params.transform(context));
        
        return mapped;
      }
    )
  );

  run.setOperation(ListOps.split, (params, scope) => (context) =>
    handleListIteration(
      array(params.list, context), 
      context, 
      scope, 
      n => 0, 
      n => n, 
      { pass: [], fail: [] },
      (item, _index, _list, result) => {
        if (params.pass(context)) {
          result.pass.push(item);
        } else {
          result.fail.push(item);
        }

        return result;
      }
    )
  );

  run.setOperation(ListOps.reduce, (params, scope) => (context) =>
    handleListIteration(array(params.list, context), context, scope, 
      n => 0, 
      n => n, 
      params.initial(context),
      (_item, _index, _list, reduced) => {
        context[scope.reduced] = reduced;

        return params.reduce(context);
      }
    )
  );

  run.setOperation(ListOps.cmp, (params, scope) => (context) => {
    const list = array(params.list, context);
    const test = array(params.test, context);
    
    if (list.length !== test.length) 
    {
      return list.length - test.length;
    }

    let less = 0, more = 0;

    handleList(list, context, scope, () => {
      for (let i = 0; i < list.length; i++) {
        context[scope.list] = list;
        context[scope.value] = list[i];
        context[scope.test] = test[i];

        const d = number(params.compare, context, 0);

        if (d < 0) less++;
        else if (d > 0) more++;
      }
    });

    return less === 0 && more === 0
      ? 0
      : less < more ? 1 : -1;
  });

  // Comparisons

  run.setOperation(ListOps.isEqual, (params, scope) => (context) => {
    const list = array(params.list, context);
    const test = array(params.test, context);
    
    if (list.length !== test.length) 
    {
      return false;
    }

    let equal = true;

    handleList(list, context, scope, () => {
      for (let i = 0; i < list.length; i++) {
        context[scope.list] = list;
        context[scope.value] = list[i];
        context[scope.test] = test[i];

        if (!params.isEqual(context)) {
          equal = false;
          break;
        }
      }
    });

    return equal;
  });

  run.setOperation(ListOps.isNotEqual, (params, scope) => (context) =>
    !run.getOperation(ListOps.isEqual.id)(params, scope)(context)
  );

  run.setOperation(ListOps.isEmpty, (params, scope) => (context) =>
    array(params.list, context).length === 0
  );

  run.setOperation(ListOps.isNotEmpty, (params, scope) => (context) =>
    array(params.list, context).length > 0
  );
  

};

function swap(arr: any[], i: number, k: number)
{
  const temp = arr[i];
  arr[i] = arr[k];
  arr[k] = temp;
}

function handleList<R>(list: any[], context: object, scope: Record<string, string>, handle: (list: any[]) => R): R
{
  const saved = saveScope(context, scope);
  
  const result = handle(list);

  restoreScope(context, saved);

  return result;
}

function handleListIteration<R>(
  list: any[],
  context: object,
  scope: Record<'list' | 'item' | 'index', string>,
  start: (n: number) => number,
  end: (n: number) => number,
  initialResult: R,
  onItem: (current: any, index: number, list: any[], lastResult: R) => R
): R 
{
  return handleList(list, context, scope, () => 
  {
    const n = list.length;
    let i = start(n);
    const e = end(n);
    const d = i < e ? 1 : -1;
    let result = initialResult;

    while (i !== e)
    {
      const item = list[i];

      context[scope.list] = list;
      context[scope.item] = item;
      context[scope.index] = i;

      result = onItem(item, i, list, result);

      i += d;
    }

    return result;
  });
}

function handleListIsEqual<R>(
  list: any[],
  context: object, 
  params: Record<'list' | 'isEqual', Command>, 
  scope: Record<'list' | 'value' | 'test', string>, 
  value: any, 
  start: (n: number) => number,
  end: (n: number) => number,
  handleMatch: (current: any, index: number, list: any[]) => R | undefined,
  getDefaultResult: (list: any[]) => R
): R
{
  return handleList(list, context, scope, () => 
  {
    const n = list.length;
    let i = start(n);
    const e = end(n);
    const d = i < e ? 1 : -1;

    while (i !== e)
    {
      const test = list[i];
      const next = list[i + d];

      context[scope.list] = list;
      context[scope.value] = value;
      context[scope.test] = test;

      if (params.isEqual(context)) 
      {
        const matchResult = handleMatch(test, i, list);

        if (matchResult !== undefined)
        {
          return matchResult;
        }
        else if (list[i] === next)
        {
          i -= d;
        }
      }

      i += d;
    }

    return getDefaultResult(list);
  });
}