import { isString, isNumber, isArray } from '../fns';
import { FastMap, FastMapOptions } from './FastMap';


export interface Named
{
  name: string;
}

export type NamedMapOptions<N extends Named> = FastMapOptions<N> | N[];

export class NamedMap<N extends Named> extends FastMap<N>
{

  public static isNamedArray<N extends Named>(x: any): x is N[]
  {
    return isArray(x) && x.length > 0 && isString(x[0].name);
  }

  public constructor(options?: NamedMapOptions<N>)
  {
    super();

    if (options)
    {
      this.merge(options);
    }
  }

  public reset(options: NamedMapOptions<N>)
  {
    this.clear();
    this.merge(options);
  }

  public merge(options: NamedMapOptions<N>)
  {
    if (NamedMap.isNamedArray(options))
    {
      for (const named of options)
      {
        this.add(named);
      }
    }
    else
    {
      super.merge(options);
    }
  }

  public rename(namedInput: string | N, newName: string): boolean
  {
    const named = this.get(namedInput);
    const valid = !!named && named.name !== newName;
    
    if (valid)
    {
      this.rekey(named, newName);
      
      named.name = newName;
    }

    return valid;
  }

  public has(named: string | N): boolean
  {
    return this.nameOf(named) in this.indexes;
  }

  public add(named: N)
  {
    this.set(named.name, named);
  }

  public nameOf(named: string | N): string
  {
    return isString(named) ? named : named.name;
  }

  public indexOf(named: string | N): number
  {
    const i = this.indexes[this.nameOf(named)];

    return isNumber(i) ? i : -1;
  }

  public keyOf(named: N): string | undefined
  {
    return named.name;
  }

  public clone(): NamedMap<N>
  {
    return new NamedMap(this);
  }

}