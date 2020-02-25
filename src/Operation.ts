
import { Type, TypeInput } from './Type';
import { isFunction } from './fns';
import { Entity } from './Entity';
import { Relation, EntityRelation } from './Relation';


export interface OperationFlags
{
  complexity: number;
  mutates: string[];
}

export interface Operation<
  P extends string = never, 
  O extends string = never,
  S extends string = never,
  H extends (P | O) = never,
  R extends (P | O) = never
> extends OperationFlags {
  id: string;
  params: P[];
  optional: O[];
  scope: S[];
  scopeDefaults: Record<S, string>;
  hasScope: H[];
  resultDependency: R[];
}

export type OperationResolved<
  P extends string, 
  O extends string, 
  S extends string, 
  H extends (P | O), 
  R extends (P | O)
> = Operation<
  string extends P ? never : P, 
  string extends O ? never : O, 
  string extends S ? never : S, 
  string extends H ? never : H extends ((string extends P ? never : P) | (string extends O ? never : O)) ? H : never, 
  string extends R ? never : R extends ((string extends P ? never : P) | (string extends O ? never : O)) ? R : never
>;

export interface OperationTypeProvider
{
  getEntity(name: string): Entity | null;
  getEntities(): Record<string, Entity>;
  getRelation(name: string): Relation | null;
  getRelations(entityName: string): EntityRelation[];
}

export type OperationTypeDynamic<I extends string> = (inputs: Partial<Record<I, Type>>, provider: OperationTypeProvider) => TypeInput;

export type OperationTypeInput<I extends string> = TypeInput | OperationTypeDynamic<I>;

export interface OperationTypes<
  P extends string = never, 
  O extends string = never,
  S extends string = never
> {
  returnType: OperationTypeInput<P | O>,
  params: Record<P, OperationTypeInput<P | O>>;
  optional: Record<O, OperationTypeInput<P | O>>;
  scope: Record<S, OperationTypeInput<P | O>>;
  rawTypes?: boolean;
}

export type OperationGeneric = Operation<any, any, any, any, any>;

export interface OperationPair<
  P extends string = any, 
  O extends string = any,
  S extends string = any
> {
  op: Operation<P, O, S, any, any>;
  types: OperationTypes<P, O, S>;
}

export interface OperationMapping
{
  from: Operation<any, any, any, any, any>;
  fromTypes: OperationTypes<any, any, any>;
  to: Operation<any, any, any, any, any>;
  toTypes: OperationTypes<any, any, any>;
  mapping: Record<string, string>;
  unmapped: string[];
}

export function isOperationTypeFunction<I extends string>(x: OperationTypeInput<I>): x is OperationTypeDynamic<I>
{
  return !('baseType' in x) && isFunction(x);
}

export class Operations
{

  public prefix: string;

  public map: Record<string, OperationGeneric>;
  public types: Record<string, OperationTypes<any, any, any>>;

  public constructor(prefix: string)
  { 
    this.prefix = prefix;
    this.map = Object.create(null);
    this.types = Object.create(null);
  }

  public get (id: string): OperationGeneric
  {
    return this.map[id] || this.map[this.prefix + id];
  }

  public getTypes (id: string): OperationTypes<any, any, any>
  {
    return this.types[id] || this.types[this.prefix + id];
  }

  public set<P extends string, O extends string, S extends string, H extends (P | O) = never, R extends (P | O) = never>(
    localId: string, 
    flags: Partial<OperationFlags> = {},
    params: P[] = [], 
    optional: O[] = [], 
    scope: S[] = [],
    hasScope: H[] = [],
    resultDependency: R[] = []
  ) : OperationResolved<P, O, S, H, R> 
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
      hasScope,
      resultDependency
    };
    
    this.map[id] = op;

    return op as unknown as OperationResolved<P, O, S, H, R>;
  }

  public setTypes(
    op: Operation<never, never, never, never, never>,
    returnType: OperationTypeInput<never>
  ) : OperationTypes<never, never, never>
  public setTypes<P extends string>(
    op: Operation<P, never, never, any, any>,
    returnType: OperationTypeInput<P>,
    params: Record<P, OperationTypeInput<P>>
  ) : OperationTypes<P, never, never>
  public setTypes<P extends string, O extends string>(
    op: Operation<P, O, never, any, any>,
    returnType: OperationTypeInput<P | O>,
    params: Record<P, OperationTypeInput<P | O>>,
    optional: Record<O, OperationTypeInput<P | O>>
  ) : OperationTypes<P, O, never>
  public setTypes<P extends string, O extends string, S extends string>(
    op: Operation<P, O, S, any, any>,
    returnType: OperationTypeInput<P | O>,
    params: Record<P, OperationTypeInput<P | O>>,
    optional: Record<O, OperationTypeInput<P | O>>,
    scope: Record<S, OperationTypeInput<P | O>>
  ) : OperationTypes<P, O, S>
  public setTypes<P extends string = never, O extends string = never, S extends string = never>(
    op: Operation<P, O, S, any, any>, 
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