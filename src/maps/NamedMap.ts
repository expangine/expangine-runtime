import { isString, isNumber, isArray, arraySync } from '../fns';
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

  public sync(options: NamedMapOptions<N>, combine?: (original: N, given: N) => void)
  {
    super.sync(new NamedMap(options), combine);
  }

  public syncManual<O extends Named = N>(
    sourceOptions: NamedMapOptions<O>,
    add: (target: this, value: O, key: string) => void,
    remove: (target: this, value: N, key: string) => void,
    update: (target: this, value: N, newValue: O, key: string) => void,
    matches?: (a: N, b: O) => boolean,
  ): this {
    const source = new NamedMap<O>(sourceOptions);

    if (matches) {
      arraySync(
        this.values, 
        source.values, 
        matches, 
        (target, value) => add(this, value, value.name), 
        (target, index, value) => remove(this, value, value.name),
        (target, index, value, newValue) => update(this, value, newValue, value.name),
      );
    } else {
      this.forEach((targetValue, targetKey) => {
        const existing = source.get(targetKey);
        if (existing === undefined) {
          remove(this, targetValue, targetKey);
        } else {
          update(this, targetValue, existing, targetKey);
        }
      });

      source.forEach((sourceValue, sourceKey) => {
        if (!this.has(sourceKey)) {
          add(this, sourceValue, sourceKey);
        }
      });
    }

    return this;
  }

  public rename(namedInput: string | N, newName: string): boolean
  {
    const named = this.get(namedInput);
    const valid = !!named && named.name !== newName;
    
    if (valid && named)
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

  public valueOf(named: N): N
  public valueOf(named: string | N): N | undefined
  public valueOf(named: string | N): N | undefined
  {
    return isString(named) ? this.get(named) : named;
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