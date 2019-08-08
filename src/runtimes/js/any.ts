
import { Runtime } from '../../Runtime';
import { AnyOps } from '../../def/AnyOps';
import { isArray, isDate } from '../../fns';


export default (run: Runtime) =>
{

  // Operations

  run.setOperation(AnyOps.cmp, (params) => (context) => 
    cmp(params.value(context), params.test(context))
  );

  run.setOperation(AnyOps.copy, (params) => (context) =>
    copy(params.value(context))
  );

  // Comparisons

  run.setOperation(AnyOps.isEqual, (params) => (context) => 
    cmp(params.value(context), params.test(context)) === 0
  );

  run.setOperation(AnyOps.isNotEqual, (params) => (context) => 
    cmp(params.value(context), params.test(context)) !== 0
  );

  run.setOperation(AnyOps.isLess, (params) => (context) => 
    cmp(params.value(context), params.test(context)) < 0
  );

  run.setOperation(AnyOps.isLessOrEqual, (params) => (context) => 
    cmp(params.value(context), params.test(context)) <= 0
  );

  run.setOperation(AnyOps.isGreater, (params) => (context) => 
    cmp(params.value(context), params.test(context)) > 0
  );

  run.setOperation(AnyOps.isGreaterOrEqual, (params) => (context) => 
    cmp(params.value(context), params.test(context)) >= 0
  );

};

const CMP_TYPES = {
  'boolean':    0,
  'number':     1,
  'bigint':     2,
  'string':     3,
  'symbol':     4,
  'object':     5,
  'undefined':  6,
  'function':   7
};

export function cmp (a: any, b: any): number
{
  if (a === b) return 0;

  const at = typeof a;
  const bt = typeof b;

  if (at !== bt) return CMP_TYPES[at] - CMP_TYPES[bt];

  const al = isArray(a);
  const bl = isArray(b);

  if (al !== bl) return (al ? 1 : 0) - (bl ? 1 : 0);
  
  if (al)
  {
    return a.length - b.length;
  }

  switch (at)
  {
    case 'object':
      const ad = a instanceof Date;
      const bd = b instanceof Date;
  
      if (ad !== bd) return (ad ? 1 : 0) - (bd ? 1 : 0);
  
      if (ad) return a.getTime() - b.getTime();

      for (const prop in a) {
        if (!(prop in b)) {
          return -1;
        }
      }

      for (const prop in b) {
        if (!(prop in a)) {
          return 1;
        }
      }

      let less = 0;
      let great = 0;

      for (const prop in a) {
        const c = cmp(a[prop], b[prop]);
        if (c < 0) less++;
        if (c > 0) great++;
      }

      return great - less;

    case 'bigint':
    case 'number':
      return a - b;
    
    case 'boolean':
      return (a ? 1 : 0) - (b ? 1 : 0);

    case 'string':
      return a.localeCompare(b);
  }

  return 0;
}

export function copy(x: any, originals: any[] = [], clones: any[] = []): any
{
  if (!x) return x; // null, undefined, 0, '', NaN, false

  if (isDate(x))
  {
    return new Date(x.getTime());
  }

  if (typeof x === 'object')
  {
    const i = originals.indexOf(x);

    if (i !== -1)
    {
      return clones[i];
    }

    if (isArray(x))
    {
      const arr: any[] = [];

      originals.push(x);
      clones.push(arr);

      for (const item of x)
      {
        arr.push(copy(item, originals, clones));
      }

      return arr;
    }

    const obj: any = {};

    originals.push(x);
    clones.push(obj);

    for (const prop in x) 
    {
      obj[prop] = copy(x[prop], originals, clones);
    }

    return obj;
  }

  return x;
}