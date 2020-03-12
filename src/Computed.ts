
import { Operation } from './Operation';



export interface Computed 
{
  id: string;
  op: string;
  value: string;
  params: Record<string, any>;
  writeable?: {
    op: string;
    value: string;
    newValue: string;
    params: Record<string, any>;
  };
}

export class Computeds
{

  public prefix: string;

  public map: Record<string, Computed>;
  public list: Computed[];

  public constructor(prefix: string)
  { 
    this.prefix = prefix;
    this.map = Object.create(null);
    this.list = [];
  }

  public set<P extends string = never, O extends string = never, V extends P = never>(localId: string, op: Operation<P, O, any, any, any>, value?: V, params?: Partial<Record<P | O, any>>): Computed 
  {
    const id = this.prefix + localId;
    const comp: Computed = {
      id,
      op: op.id,
      value: value || op.params[0],
      params: params || {},
    };

    this.map[id] = comp;
    this.list.push(comp);

    return comp;
  }

  public setWritable<P extends string = never, O extends string = never, V extends P = never, N extends P = never>(localId: string, op: Operation<P, O, any, any, any>, value: V, newValue: N, params?: Partial<Record<P | O, any>>): Computed 
  {
    const id = this.prefix + localId;
    const comp = this.map[id];

    comp.writeable = { 
      op: op.id,
      value,
      newValue,
      params: params || {},
    };

    return comp;
  }

  public get (id: string): Computed
  {
    return this.map[id] || this.map[this.prefix + id];
  }

}