
import { Type, TypeInput, TypeMap } from './Type';


export type OperationOptions<
  R extends TypeInput, 
  P extends TypeMap = never, 
  O extends TypeMap = never, 
  S extends TypeMap = never
> = [R]
  | [R, P]
  | [R, P, O] 
  | [R, P, O, S];

export interface Operation<
  R extends TypeInput = any, 
  P extends TypeMap = never, 
  O extends TypeMap = never, 
  S extends TypeMap = never
> {
  id: string;
  returnType: R;
  params?: P;
  optional?: O;
  scope?: S;
}

export interface OperationBuilder<
  T extends Type,
  R extends TypeInput = any, 
  P extends TypeMap = never, 
  O extends TypeMap = never, 
  S extends TypeMap = never
> {
  id: string;
  (type: T): Operation<R, P, O, S>;
}

export class Operations<T extends Type> 
{

  public prefix: string;

  public map: Record<string, OperationBuilder<T>>;

  public constructor(prefix: string)
  { 
    this.prefix = prefix;
    this.map = Object.create(null);
  }

  public get (id: string, type: T): Operation<any, any, any, any>
  {
    const builder = this.map[id] || this.map[this.prefix + id];

    return builder(type);
  }

  public set<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never>(
    localId: string, 
    returnType: R, 
    params?: P, 
    optional?: O, 
    scope?: S
  ): OperationBuilder<T, R, P, O, S> 
  {
    const id = this.prefix + localId;
    const op = { id, returnType, params, optional, scope };

    return this.put(id, () => op);
  }

  public build<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never>(
    localId: string,
    getOptions: (type: T) => OperationOptions<R, P, O, S>
  ): OperationBuilder<T, R, P, O, S> 
  {
    const id = this.prefix + localId;

    return this.put(id, (type) =>
    {
      const [returnType, params, optional, scope] = getOptions(type);

      return { id, returnType, params, optional, scope };
    });
  }

  private put<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never>(
    id: string, 
    getOperation: (type: T) => Operation<R, P, O, S>): OperationBuilder<T, R, P, O, S>
  {
    const builder = getOperation as OperationBuilder<T, R, P, O, S>;

    builder.id = id;

    this.map[id] = builder as OperationBuilder<T>;

    return builder;
  }

}