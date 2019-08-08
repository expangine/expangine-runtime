
import { Type, TypeInput, TypeMap } from './Type';
import { mapObject } from './fns';


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
  scopeDefaults: Record<keyof S, string>;
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

  public getBuilder (id: string): OperationBuilder<any>
  {
    return this.map[id] || this.map[this.prefix + id];
  }

  public get (id: string, type: T): Operation<any, any, any, any>
  {
    return this.getBuilder(id)(type);
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
    const scopeDefaults = mapObject(scope || {}, (_, key) => key);

    return this.put(id, scopeDefaults as any, () => op);
  }

  public build<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never>(
    localId: string,
    getOptions: (type: T) => OperationOptions<R, P, O, S>,
    scopeDefaults?: Record<keyof S, string>
  ): OperationBuilder<T, R, P, O, S> 
  {
    const id = this.prefix + localId;

    return this.put(id, scopeDefaults, (type) =>
    {
      const [returnType, params, optional, scope] = getOptions(type);

      return { id, returnType, params, optional, scope };
    });
  }

  private put<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never>(
    id: string, 
    scopeDefaults: Record<keyof S, string>,
    getOperation: (type: T) => Operation<R, P, O, S>): OperationBuilder<T, R, P, O, S>
  {
    const builder = getOperation as OperationBuilder<T, R, P, O, S>;

    builder.scopeDefaults = scopeDefaults;
    builder.id = id;

    this.map[id] = builder as OperationBuilder<T>;

    return builder;
  }

}