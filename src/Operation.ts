
import { Type, TypeInput, TypeMap } from './Type';
import { mapObject } from './fns';
import { GenericType } from './types/Generic';


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
  S extends TypeMap = never,
  G extends string = never
> {
  id: string;
  returnType: R;
  params?: P;
  optional?: O;
  scope?: S;
  generics?: Record<G, GenericType>;
}

export interface OperationBuilder<
  T extends Type,
  R extends TypeInput = any, 
  P extends TypeMap = never, 
  O extends TypeMap = never, 
  S extends TypeMap = never,
  G extends string = never
> {
  id: string;
  scopeDefaults?: Record<keyof S, string>;
  (type: T): Operation<R, P, O, S, G>;
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

  public get (id: string, type: T): Operation<any, any, any, any, any>
  {
    return this.getBuilder( id )( type );
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
    const scopeDefaults = scope 
      ? mapObject(scope, (_, key) => key) as Record<keyof S, string>
      : undefined;

    return this.put(id, scopeDefaults, () => op);
  }

  public build<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never, G extends string = never>(
    localId: string,
    getOptions: (type: T, generics?: Record<G, GenericType>) => OperationOptions<R, P, O, S>,
    scopeDefaults?: Record<keyof S, string>,
    generics?: Record<G, GenericType>
  ): OperationBuilder<T, R, P, O, S> 
  {
    const id = this.prefix + localId;

    return this.put(id, scopeDefaults, (type) =>
    {
      const [returnType, params, optional, scope] = getOptions(type, generics);

      return { id, returnType, params, optional, scope, generics };
    });
  }

  private put<R extends TypeInput = any, P extends TypeMap = never, O extends TypeMap = never, S extends TypeMap = never, G extends string = never>(
    id: string, 
    scopeDefaults: Record<keyof S, string> | undefined,
    getOperation: (type: T) => Operation<R, P, O, S, G>): OperationBuilder<T, R, P, O, S, G>
  {
    const builder = getOperation as OperationBuilder<T, R, P, O, S, G>;

    builder.scopeDefaults = scopeDefaults;
    builder.id = id;

    this.map[id] = builder as unknown as OperationBuilder<T>;

    return builder;
  }

}