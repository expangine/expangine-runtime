
import { Type, TypeInput } from './Type';


export interface OperationFlags
{
  complexity: number;
  mutates: string[];
}

export interface Operation<
  P extends string = never, 
  O extends string = never,
  S extends string = never
> extends OperationFlags {
  id: string;
  params: P[];
  optional: O[];
  scope: S[];
  scopeDefaults?: Record<S, string>;
}

export type OperationTypeInput<I extends string> = TypeInput | ((inputs: Record<I, Type | undefined>) => TypeInput);

export interface OperationTypes<
  P extends string = never, 
  O extends string = never,
  S extends string = never
> {
  returnType: OperationTypeInput<P | O>,
  params: Record<P, OperationTypeInput<P | O>>;
  optional: Record<O, OperationTypeInput<P | O>>;
  scope: Record<S, OperationTypeInput<P | O>>;
}

export class Operations
{

  public prefix: string;

  public map: Record<string, Operation<any, any, any>>;
  public types: Record<string, OperationTypes<any, any, any>>;

  public constructor(prefix: string)
  { 
    this.prefix = prefix;
    this.map = Object.create(null);
    this.types = Object.create(null);
  }

  public get (id: string): Operation<any, any, any>
  {
    return this.map[id] || this.map[this.prefix + id];
  }

  public getTypes (id: string): OperationTypes<any, any, any>
  {
    return this.types[id] || this.types[this.prefix + id];
  }

  public set<P extends string = never, O extends string = never, S extends string = never>(
    localId: string, 
    flags: Partial<OperationFlags> = {},
    params: P[] = [], 
    optional: O[] = [], 
    scope: S[] = []
  ): Operation<P, O, S> 
  {
    const id = this.prefix + localId;
    const mutates = flags.mutates || [];
    const complexity = flags.complexity || 0;
    const scopeDefaults: Record<S, string> = Object.create(null);
    scope.forEach((s) => scopeDefaults[s] = s);

    const op = { 
      id, 
      mutates, 
      complexity, 
      params,
      optional,
      scope,
      scopeDefaults,
    };
    
    this.map[id] = op;

    return op;
  }

  public setTypes(
    op: Operation<never, never, never>,
    returnType: OperationTypeInput<never>
  ) : OperationTypes<never, never, never>
  public setTypes<P extends string>(
    op: Operation<P, never, never>,
    returnType: OperationTypeInput<P>,
    params: Record<P, OperationTypeInput<P>>
  ) : OperationTypes<P, never, never>
  public setTypes<P extends string, O extends string>(
    op: Operation<P, O, never>,
    returnType: OperationTypeInput<P | O>,
    params: Record<P, OperationTypeInput<P | O>>,
    optional: Record<O, OperationTypeInput<P | O>>
  ) : OperationTypes<P, O, never>
  public setTypes<P extends string, O extends string, S extends string>(
    op: Operation<P, O, S>,
    returnType: OperationTypeInput<P | O>,
    params: Record<P, OperationTypeInput<P | O>>,
    optional: Record<O, OperationTypeInput<P | O>>,
    scope: Record<S, OperationTypeInput<P | O>>
  ) : OperationTypes<P, O, S>
  public setTypes<P extends string = never, O extends string = never, S extends string = never>(
    op: Operation<P, O, S>, 
    returnType: OperationTypeInput<P | O>,
    params: Record<P, OperationTypeInput<P | O>> = Object.create(null),
    optional: Record<O, OperationTypeInput<P | O>> = Object.create(null),
    scope: Record<S, OperationTypeInput<P | O>> = Object.create(null)
  ): OperationTypes<P, O, S> {

    const types = { returnType, params, optional, scope };

    this.types[op.id] = types;

    return types;
  }

}