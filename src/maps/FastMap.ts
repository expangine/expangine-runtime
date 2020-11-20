import { isString, isNumber, isArray, isObject } from '../fns';


export type FastMapOptions<T> = Map<string, T> | Record<string, T> | Array<[string, T]> | FastMap<T>;


export class FastMap<T>
{

  public indexes: Record<string, number>;
  public keys: string[];
  public values: T[];

  public constructor(options?: FastMapOptions<T>)
  {
    this.indexes = Object.create(null);
    this.keys = [];
    this.values = [];

    if (options)
    {
      this.merge(options);
    }
  }

  public reset(options: FastMapOptions<T>)
  {
    this.clear();
    this.merge(options);
  }

  public merge(options: FastMapOptions<T>)
  {
    if (options instanceof Map)
    {
      for (const [key, value] of options.entries())
      {
        this.set(key, value);
      }
    }
    else if (options instanceof FastMap)
    {
      for (let i = 0; i < options.length(); i++)
      {
        const key = options.keyAt(i);
        const value = options.valueAt(i);

        if (key !== undefined && value !== undefined)
        {
          this.set(key, value);
        }
      }
    }
    else if (isArray(options))
    {
      for (const [key, value] of options)
      {
        this.set(key, value);
      }
    }
    else if (isObject(options))
    {
      for (const key in options)
      {
        this.set(key, options[key]);
      }
    }
  }

  public sync(options: FastMapOptions<T>, combine?: (original: T, given: T) => void)
  {
    const all = new FastMap(options);

    this.filter((_, key) => all.has(key));
    
    all.forEach((value, key) => {
      if (this.has(key) && combine) {
        combine(this.get(key) as T, value);
      } else {
        this.set(key, value);
      }
    });
  }

  public clear()
  {
    this.indexes = Object.create(null);
    this.keys = [];
    this.values = [];
  }

  public length(): number
  {
    return this.keys.length;
  }

  public valueAt(i: number): T | undefined
  {
    return this.values[i];
  }

  public keyAt(i: number): string | undefined
  {
    return this.keys[i];
  }

  public pairAt(i: number): [string, T] | [undefined, undefined]
  {
    return [this.keys[i], this.values[i]];
  }

  public has(key: string | T): boolean
  { 
    return isString(key) ? key in this.indexes : this.values.includes(key);
  }

  public set(key: string, value: T)
  {
    const i = this.indexes[key];

    if (isNumber(i)) 
    {
      this.values.splice(i, 1, value);
    } 
    else 
    {
      this.indexes[key] = this.values.length;
      this.values.push(value);
      this.keys.push(key);
    }
  }

  public rekey(old: string | T, newKey: string): boolean
  {
    const i = this.indexOf(old);
    const exists = i !== -1;

    if (exists)
    {
      delete this.indexes[this.keys[i]];
      this.indexes[newKey] = i;
      this.keys.splice(i, 1, newKey);
    }

    return exists;
  }

  public sort(cmp: (a: T, b: T) => number)
  {
    this.reset(this.toPairs().sort(([ak, av], [bk, bv]) => cmp(av, bv)));
  }

  public sortByKey(cmp: (a: string, b: string) => number = (a, b) => a.localeCompare(b))
  {
    this.reset(this.toPairs().sort(([ak, av], [bk, bv]) => cmp(ak, bk)));
  }

  public reindex(): void
  {
    const keys = this.keys;
    const indexes = Object.create(null);

    for (let i = 0; i < keys.length; i++)
    {
      indexes[keys[i]] = i;
    }

    this.indexes = indexes;
  }

  public swap(i: number, k: number): boolean
  {
    if (i === k || i < 0 || k < 0 || i >= this.keys.length || k >= this.keys.length)
    {
      return false;
    }

    const ikey = this.keys[i];
    const ivalue = this.values[i];
    const kkey = this.keys[k];
    const kvalue = this.values[k];

    this.indexes[ikey] = k;
    this.indexes[kkey] = i;

    this.keys.splice(i, 1, kkey);
    this.keys.splice(k, 1, ikey);

    this.values.splice(i, 1, kvalue);
    this.values.splice(k, 1, ivalue);

    return true;
  }

  public get(key: string | T): T | undefined
  public get<O>(key: string | T, otherwise: O): T | O
  public get<O>(key: string | T, otherwise?: O): T | O | undefined
  {
    return isString(key) 
      ? this.values[this.indexes[key]] || otherwise 
      : key;
  }

  public remove(key: string | T, respectOrder: boolean = false): T | undefined
  {
    const i = this.indexOf(key);

    if (i !== -1)
    {
      const { keys, values } = this;
      const removing = values[i];

      if (respectOrder)
      {
        this.removeAt(i);
      }
      else
      {
        delete this.indexes[keys[i]];
        const lastKey = keys.pop();
        const lastValue = values.pop();

        if (i !== keys.length && lastKey !== undefined && lastValue !== undefined)
        {
          keys.splice(i, 1, lastKey);
          values.splice(i, 1, lastValue);
          this.indexes[lastKey] = i;
        }
      }

      return removing;
    }
  }

  public removeAt(i: number): boolean
  {
    const { keys, values } = this;

    if (i < 0 || i >= keys.length)
    {
      return false;
    }

    delete this.indexes[keys[i]];
    keys.splice(i, 1);
    values.splice(i, 1);

    while (++i < keys.length)
    {
      this.indexes[keys[i]]--;
    }

    return true;
  }

  public move(from: number, to: number): boolean
  {
    const { keys, values } = this;

    if (from < 0 || to < 0 || from >= keys.length || to >= keys.length)
    {
      return false;
    }

    if (from !== to)
    {
      const value = values[from];
      const key = keys[from];

      values.splice(from, 1);
      keys.splice(from, 1);

      values.splice(to, 0, value);
      keys.splice(to, 0, key);
      
      this.reindex();
    }

    return true;
  }

  public moveToFront(key: string | T): boolean
  {
    const i = this.indexOf(key);

    if (i === -1)
    {
      return false;
    }

    return this.move(i, 0);
  }

  public moveToBack(key: string | T): boolean
  {
    const i = this.indexOf(key);

    if (i === -1)
    {
      return false;
    }

    return this.move(i, this.keys.length - 1);
  }

  public indexOf(key: string | T): number
  {
    return isString(key) 
      ? key in this.indexes
        ? this.indexes[key]
        : -1
      : this.values.indexOf(key);
  }

  public keyOf(value: T): string | undefined
  {
    const i = this.values.indexOf(value);

    return i === -1 ? undefined : this.keys[i];
  }

  public toPairs(): Array<[string, T]>
  {
    return this.values.map((value, i) => [this.keys[i], value]);
  }

  public toMap(): Map<string, T>
  {
    return new Map(this.toPairs());
  }

  public toObject(): Record<string, T>
  {
    const obj = Object.create(null);

    for (let i = 0; i < this.keys.length; i++)
    {
      obj[this.keys[i]] = this.values[i];
    }

    return obj;
  }

  public clone(): FastMap<T>
  {
    return new FastMap(this);
  }

  public forEach(iterator: (value: T, key: string) => void)
  {
    const { keys, values } = this;
    let i = 0;

    while (i < keys.length)
    {
      const key = keys[i];
      const value = values[i];

      iterator(value, key);

      if (keys[i] === key)
      {
        i++;
      }
    }
  }

  public filter(pass: (value: T, key: string) => boolean)
  {
    const { values, keys, indexes } = this;
    let passed = 0; 
    
    for (let i = 0; i < values.length; i++) 
    {
      const value = values[i];
      const key = keys[i];

      if (pass(value, key))
      {
        values[passed] = value;
        keys[passed] = key;
        indexes[key] = passed;
        passed++;
      }
      else
      {
        delete indexes[key];
      }
    }

    if (passed < values.length)
    {
      values.splice(passed, values.length - passed);
      keys.splice(passed, keys.length - passed);
    }
  }

}