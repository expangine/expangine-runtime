import { Type, TypeClass, TypeMap, TypeProvider, TypeDescribeProvider, TypeMapInput } from './Type';
import { Expression, ExpressionMap } from './Expression';
import { Computed } from './Computed';
import { OperationTypes, OperationGeneric, OperationMapping, OperationTypeInput, OperationPair } from './Operation';
import { Func } from './Func';
import { Entity } from './Entity';
import { Relation } from './Relation';
import { ReferenceData } from './ReferenceData';
import { Program } from './Program';
import { RuntimeOptions } from './RuntimeOptions';


export interface DefinitionProvider extends TypeProvider, TypeDescribeProvider
{
  options: RuntimeOptions;

  setLegacy(): void;
  isLegacy(): boolean;

  describe(data: any): Type;
  merge(type: Type, data: any): Type;

  getExpression(data: any): Expression;
  isExpression(value: any): value is (Expression | [string, ...any[]]);

  getType(data: any, otherwise?: Type): Type;
  getTypeKind<T extends Type>(value: any, kind: TypeClass<T>, otherwise?: T): T | undefined;
  getPathType(path: Expression[], context: Type, stopBefore?: number): Type | undefined;
  getBaseTypes(): Type[];
  getSimpleTypes(): Type[];
  getComplexTypes(): Type[];
  getSimpleTypeClasses(): TypeClass[];
  getComplexTypeClasses(): TypeClass[];

  getContextWithScope(original: Type, scope?: TypeMap): { context: Type, scope: TypeMap };
  getContext(original: Type, scope: TypeMap): Type;

  getOperation(id: string): OperationGeneric | undefined;
  getOperationTypes(id: string): OperationTypes<any, any, any> | undefined;
  getOperationReturnType(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type): Type | undefined;
  getOperationExpectedTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type, rawTypes?: boolean): TypeMapInput;
  getOperationParamTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type, rawTypes?: boolean): TypeMapInput;
  getOperationScopeContext(id: string, types: TypeMapInput, scopeAlias: Record<string, string>, context: Type): Type;
  
  getOperationMapping(fromId: string, fromParamTypes: TypeMap, toId: string): OperationMapping | undefined;
  getOperationInputType(input: OperationTypeInput<any>, params?: TypeMapInput): Type | undefined;
  getOperationsForExpression(expr: Expression, context: Type): OperationPair[];
  getOperationsWithMapping(fromId: string, fromParamTypes: TypeMap): OperationMapping[];
  getOperationsForType(type: Type, acceptsDynamic?: boolean): OperationPair[];
  getOperationsWithReturnExpression(expr: Expression, context: Type, paramTypes?: TypeMap, acceptsDynamic?: boolean): OperationPair[];
  getOperationsWithReturnType(type: Type, paramTypes?: TypeMap, acceptsDynamic?: boolean): OperationPair[];
  getOperationsForParamExpressions(params: ExpressionMap, context: Type): OperationPair[];
  getOperationsForParamTypes(paramTypes: TypeMap): OperationPair[];
  getOperations(onOperation?: <P extends string, O extends string, S extends string>(pair: OperationPair<P, O, S>) => boolean): OperationPair[];

  getComputed(id: string): Computed | undefined;
  getComputedReturnType(id: string, valueType?: Type): Type | undefined;
  getComputedsFor(valueType: Type): Computed[];
  hasComputed(valueType: Type, id: string): boolean;

  getProgram(name: string): Program | undefined;

  getData(name: string): ReferenceData | undefined;
  
  getFunction(name: string): Func | undefined;

  getEntity(name: string): Entity | undefined;

  getRelation(name: string): Relation | undefined;
}