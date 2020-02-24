import { Type, TypeClass, TypeMap, TypeProvider, TypeDescribeProvider } from './Type';
import { Expression, ExpressionMap } from './Expression';
import { Computed } from './Computed';
import { OperationTypes, OperationGeneric, OperationMapping, OperationTypeInput, OperationPair } from './Operation';
import { Func } from './Func';
import { Entity } from './Entity';
import { Relation } from './Relation';


export interface DefinitionProvider extends TypeProvider, TypeDescribeProvider
{
  describe(data: any): Type;
  merge(type: Type, data: any): Type;

  getExpression(data: any): Expression;

  getType(data: any, otherwise?: Type): Type;
  getTypeKind<T extends Type>(value: any, kind: TypeClass<T>, otherwise?: T | null): T | null;
  getPathType(path: Expression[], context: Type, stopBefore?: number): Type | null;
  getBaseTypes(): Type[];
  getSimpleTypes(): Type[];
  getComplexTypes(): Type[];
  getSimpleTypeClasses(): TypeClass[];
  getComplexTypeClasses(): TypeClass[];

  getContextWithScope(original: Type, scope?: TypeMap): { context: Type, scope: TypeMap };
  getContext(original: Type, scope: TypeMap): Type;

  getOperation(id: string): OperationGeneric | null;
  getOperationTypes(id: string): OperationTypes<any, any, any> | null;
  getOperationReturnType(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type): Type | null;
  getOperationExpectedTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type, rawTypes?: boolean): TypeMap;
  getOperationParamTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type, rawTypes?: boolean): TypeMap;
  getOperationScopeContext(id: string, types: TypeMap, scopeAlias: Record<string, string>, context: Type): Type;
  
  getOperationMapping(fromId: string, fromParamTypes: TypeMap, toId: string): OperationMapping | null;
  getOperationInputType(input: OperationTypeInput<any>): Type | null;
  getOperationInputType(input: OperationTypeInput<any>, params: TypeMap): Type;
  getOperationInputType(input: OperationTypeInput<any>, params?: TypeMap): Type;
  getOperationsForExpression(expr: Expression, context: Type): OperationPair[];
  getOperationsWithMapping(fromId: string, fromParamTypes: TypeMap): OperationMapping[];
  getOperationsForType(type: Type, acceptsDynamic?: boolean): OperationPair[];
  getOperationsWithReturnExpression(expr: Expression, context: Type, paramTypes?: TypeMap, acceptsDynamic?: boolean): OperationPair[];
  getOperationsWithReturnType(type: Type, paramTypes?: TypeMap, acceptsDynamic?: boolean): OperationPair[];
  getOperationsForParamExpressions(params: ExpressionMap, context: Type): OperationPair[];
  getOperationsForParamTypes(paramTypes: TypeMap): OperationPair[];
  getOperations(onOperation?: <P extends string, O extends string, S extends string>(pair: OperationPair<P, O, S>) => boolean): OperationPair[];

  getComputed(id: string): Computed | null;
  getComputedReturnType(id: string, valueType?: Type | null): Type | null;
  getComputedsFor(valueType: Type): Computed[];
  hasComputed(valueType: Type, id: string): boolean;
  
  getFunction(name: string): Func | null;

  getEntity(name: string): Entity | null;

  getRelation(name: string): Relation | null;
}