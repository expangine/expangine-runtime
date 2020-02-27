
import { isArray, objectMap, objectValues, objectEach } from './fns';
import { Type, TypeClass, TypeParser, TypeMap, TypeCompatibleOptions } from './Type';
import { Expression, ExpressionClass, ExpressionMap } from './Expression';
import { Operations, OperationTypes, OperationTypeInput, OperationGeneric, OperationPair, OperationMapping, isOperationTypeFunction, OperationTypeProvider } from './Operation';
import { Computeds, Computed } from './Computed';
import { Relation, RelationOptions, EntityRelation } from './Relation';
import { Program, ProgramOptions, ProgramDataSet } from './Program';
import { Entity, EntityOptions, EntityProps, EntityTranscoder } from './Entity';
import { Func, FuncOptions, FuncTest } from './Func';
import { Types } from './Types';
import { Traverser } from './Traverser';
import { ID } from './types/ID';
import { EntityType } from './types/Entity';
import { AnyType } from './types/Any';
import { ManyType } from './types/Many';
import { ObjectType } from './types/Object';
import { NullType } from './types/Null';
import { ConstantExpression } from './exprs/Constant';
import { GetEntityExpression } from './exprs/GetEntity';
import { NoExpression } from './exprs/No';
import { InvokeExpression } from './exprs/Invoke';
import { GetRelationExpression } from './exprs/GetRelation';
import { Runtime } from './Runtime';
import { DefinitionProvider } from './DefinitionProvider';
import { ReferenceDataOptions, ReferenceData } from './ReferenceData';
import { GetDataExpression } from './exprs/GetData';
import { ReferenceType } from './types/Reference';
import { NamedMap } from './maps/NamedMap';
import { FastMap } from './maps/FastMap';



export interface DefinitionsImportOptions
{
  entities?: Record<string, Entity | EntityOptions>;
  functions?: Record<string, Func | FuncOptions>;
  relations?: Record<string, RelationOptions>;
  programs?: Record<string, Program | ProgramOptions>;
  data?: Record<string, ReferenceData | ReferenceDataOptions>;
}

export interface DefinitionsOptions extends DefinitionsImportOptions
{
  types?: TypeClass[];
  expressions?: ExpressionClass[];
}

export type DefinitionsReferenceSource = 
  Program | 
  [Program, ProgramDataSet] |
  Entity | 
  [Entity, 'key' | 'describe'] |
  [Entity, string, EntityTranscoder] |
  [Entity, string, EntityTranscoder, 'encode' | 'decode'] |
  [Entity, Func] |
  [Entity, Func, 'params' | 'returnType'] |
  [Entity, Func, FuncTest, 'args' | 'expected'] |
  Func | 
  [Func, 'params' | 'returnType'] |
  [Func, FuncTest, 'args' | 'expected'] |
  Relation |
  ReferenceData;

export type DefinitionsEntityReference = (
  { value: EntityType, root: Type } |
  { value: GetEntityExpression, root: Expression }
) & { source: DefinitionsReferenceSource };

export type DefinitionsDataReference = (
  { value: ReferenceType, root: Type } |
  { value: GetDataExpression, root: Expression }
) & { source: DefinitionsReferenceSource };

export interface DefinitionsRelationReference
{
  value: GetRelationExpression;
  root: Expression;
  source: DefinitionsReferenceSource;
}

export interface DefinitionsFunctionReference
{
  value: InvokeExpression;
  root: Expression;
  source: DefinitionsReferenceSource;
}

export interface DefinitionsExpressionReference<E extends Expression>
{
  value: E;
  root: Expression;
  source: DefinitionsReferenceSource;
}

export interface DefinitionsTypeReference<T extends Type>
{
  value: T;
  root: Type;
  source: DefinitionsReferenceSource;
}

export interface DefinitionsDataTypeReference<T extends Type>
{
  type: T;
  data: any;
  root: Type;
  source: DefinitionsReferenceSource;
}

export interface DefinitionsDataInstance
{
  data: any;
  type: Type;
  source: DefinitionsReferenceSource;
}

export interface DefinitionsTypeInstance
{
  type: Type;
  source: DefinitionsReferenceSource;
}

export interface DefinitionsExpressionInstance
{
  expr: Expression;
  context: Type;
  source: DefinitionsReferenceSource;
}

export class Definitions implements OperationTypeProvider, DefinitionProvider
{

  public types: Record<string, TypeClass>;
  public typeList: TypeClass[];
  public describers: TypeClass[];
  public parsers: Record<string, TypeParser>;
  public expressions: Record<string, ExpressionClass>;
  public operations: Operations;
  public computeds: Computeds;

  public relations: NamedMap<Relation>;
  public programs: NamedMap<Program>;
  public entities: NamedMap<Entity>;
  public functions: NamedMap<Func>;
  public data: NamedMap<ReferenceData>;

  public keyExpectedType: Type;
  public describeExpectedType: Type;

  public constructor(initial?: DefinitionsOptions)
  { 
    this.types = Object.create(null);
    this.typeList = [];
    this.describers = [];
    this.expressions = Object.create(null);
    this.operations = new Operations('');
    this.computeds = new Computeds('');
    this.parsers = Object.create(null);

    this.entities = new NamedMap();
    this.functions = new NamedMap();
    this.relations = new NamedMap();
    this.programs = new NamedMap();
    this.data = new NamedMap();

    this.keyExpectedType = Types.many(Types.text(), Types.number());
    this.describeExpectedType = Types.text();

    if (initial) 
    {
      this.add(initial);
    }
  }

  private encodeMap<O, V extends { encode(): O }>(map: FastMap<V>): Record<string, O>;
  private encodeMap<O, V extends { encode(): O }>(map: FastMap<V>, encode: false): Record<string, V>;
  private encodeMap<O, V extends { encode(): O }>(map: FastMap<V>, encode?: boolean): Record<string, O | V>
  private encodeMap<O, V extends { encode(): O }>(map: FastMap<V>, encode: boolean = true): Record<string, O | V>
  {
    return objectMap(map.toObject(), (v) => encode ? v.encode() : v);
  }

  public extend(deepCopy: boolean = false, initial?: DefinitionsOptions): Definitions
  { 
    const copy = new Definitions({
      types: objectValues(this.types),
      expressions: objectValues(this.expressions),
      entities: this.encodeMap(this.entities, deepCopy),
      functions: this.encodeMap(this.functions, deepCopy),
      relations: this.encodeMap(this.relations, deepCopy),
      programs: this.encodeMap(this.programs, deepCopy),
      data: this.encodeMap(this.data, deepCopy),
    });

    if (initial)
    {
      copy.add(initial);
    }

    return copy;
  }

  public add(options: DefinitionsOptions)
  {
    if (options.types) 
    {
      options.types.forEach(type => this.addType(type, true));
    }

    this.sortDescribers();

    if (options.expressions) 
    {
      options.expressions.forEach(expr => this.addExpression(expr));
    }

    this.import(options);
  }

  public describe(data: any): Type
  {
    for (const describer of this.describers)
    {
      const type = describer.describe(data, this);

      if (type)
      {
        return type;
      }
    }

    return AnyType.baseType;
  }

  public merge(type: Type, data: any): Type
  {
    return Types.merge(type, this.describe(data));
  }
  
  public sortDescribers()
  {
    this.describers.sort((a, b) => b.describePriority - a.describePriority);
  }

  public addType<T extends Type>(type: TypeClass<T>, delaySort: boolean = false) 
  {
    this.types[type.id] = type;
    this.typeList.push(type);
    this.parsers[type.id] = (data, types) => type.decode(data, types);
    this.describers.push(type);

    if (!delaySort)
    {
      this.sortDescribers();
    }

    if (!type.registered)
    {
      type.registered = true;
      type.register();
    }
  }

  public findEntity(type: Type, options: TypeCompatibleOptions = { strict: true, value: false, exact: false }): string | false
  {
    const found = this.entities.values.find((entity) => entity.type.isCompatible(type, options));

    return found ? found.name : false;
  }

  public addData(data: ReferenceData | Partial<ReferenceDataOptions>): this
  {
    this.data.add(data instanceof ReferenceData ? data : ReferenceData.create(this, data));

    return this;
  }

  public getData(name: string): ReferenceData | null
  {
    return this.data.get(name, null);
  }

  public getDatas(): NamedMap<ReferenceData>
  {
    return this.data;
  }

  public removeData(data: string | ReferenceData, stopWithReferences: boolean = true, respectOrder: boolean = false): boolean
  {
    if (!this.data.has(data))
    {
      return true;
    }

    if (stopWithReferences && this.getDataReferences(data).length > 0)
    {
      return false;
    }

    this.data.remove(data, respectOrder);

    return true;
  }

  public clearData()
  {
    this.data.clear();
  }

  public renameData(data: string | ReferenceData, newName: string): false | DefinitionsDataReference[]
  {
    if (!this.data.rename(data, newName))
    {
      return false;
    }

    const refs = this.getDataReferences(data);

    refs.forEach((ref) => 
    {
      if (ref.value instanceof ReferenceType) 
      {
        ref.value.options = newName;
      } 
      else 
      {
        ref.value.name = newName;
      }
    });

    return refs;
  }

  public addFunction(func: Func | Partial<FuncOptions>): this
  {
    this.functions.add(func instanceof Func ? func : Func.create(this, func));

    return this;
  }

  public getFunction(name: string): Func | null
  {
    return this.functions.get(name, null);
  }  

  public getFunctions(): NamedMap<Func>
  {
    return this.functions;
  }

  public addProgram(program: Program | Partial<ProgramOptions>): this
  {
    this.programs.add(program instanceof Program ? program : Program.create(this, program));

    return this;
  }

  public getProgram(name: string): Program | null
  {
    return this.programs.get(name, null);
  }

  public getPrograms(): NamedMap<Program>
  {
    return this.programs;
  }

  public removeProgram(program: string | Program, respectOrder: boolean = false): boolean
  {
    this.programs.remove(program, respectOrder);

    return true;
  }

  public clearPrograms()
  {
    this.programs.clear();
  }
  
  public addEntity(entity: Entity | Partial<EntityOptions>): this
  {
    this.entities.add(entity instanceof Entity ? entity : Entity.create(this, entity));

    return this;
  }

  public getEntity(name: string): Entity | null
  {
    return this.entities.get(name, null);
  }

  public getEntities(): NamedMap<Entity>
  {
    return this.entities;
  }

  public addRelation(relation: Relation | RelationOptions): this
  {
    this.relations.add(relation instanceof Relation ? relation : new Relation(this, relation));

    return this;
  }

  public getRelation(name: string): Relation | null
  {
    return this.relations.get(name, null);
  }

  public getRelations(entityName: string): EntityRelation[]
  {
    const relations: EntityRelation[] = [];

    this.relations.forEach((relation) =>
    {
      const subjectRelation = relation.getSubjectRelation(entityName);

      if (subjectRelation)
      {
        relations.push(subjectRelation);
      }

      const relatedRelation = relation.getRelatedRelation(entityName);

      if (relatedRelation)
      {
        relations.push(relatedRelation);
      }
    });

    return relations;
  }

  public getEntityProps(name: string): EntityProps[]
  {
    const keys: EntityProps[] = [];
    const entity = this.entities.get(name);

    if (entity)
    {
      keys.push(entity.getEntityProps());

      this.relations.forEach((relation) =>
      {
        keys.push(...relation.getTypeProps(name));
      });
    }

    return keys;
  }

  public removeRelation(relation: string | Relation, stopWithReferences: boolean = true, respectOrder: boolean = false): boolean
  {
    if (!this.relations.has(relation))
    {
      return true;
    }

    if (stopWithReferences && this.getRelationReferences(relation).length > 0)
    {
      return false;
    }

    this.relations.remove(relation, respectOrder);

    return true;
  }

  public clearRelations()
  {
    this.relations.clear();
  }

  public renameProgram(program: string | Program, newName: string): boolean
  {
    return this.programs.rename(program, newName);
  }

  public renameEntity(entity: string | Entity, newName: string): false | DefinitionsEntityReference[]
  {
    if (!this.entities.rename(entity, newName))
    {
      return false;
    }

    this.relations.forEach((relation) => 
    {
      relation.rename(name, newName);
    });

    const refs = this.getEntityReferences(name);

    refs.forEach((ref) => 
    {
      if (ref.value instanceof EntityType) 
      {
        ref.value.options = newName;
      } 
      else 
      {
        ref.value.name = newName;
      }
    });

    return refs;
  }

  public renameEntityProp(name: string | Entity, prop: string, newProp: string)
  {
    const entity = this.entities.get(name);

    if (entity)
    {
      entity.renameProp(prop, newProp);

      this.relations.forEach((relation) =>
      {
        relation.renameProp(entity.name, prop, newProp);
      });
    }
  }

  public removeEntityProp(name: string | Entity, prop: string)
  {
    const entity = this.entities.get(name);

    if (entity)
    {
      entity.removeProp(prop);

      this.relations.forEach((relation) =>
      {
        relation.removeProp(entity.name, prop);

        if (relation.isEmpty())
        {
          this.relations.remove(relation);
        }
      });
    } 
  }

  public removeEntity(entity: string | Entity, stopWithReferences: boolean = true, respectOrder: boolean = false): boolean
  {
    if (!this.entities.has(entity))
    {
      return true;
    }

    if (stopWithReferences && this.getEntityReferences(entity).length > 0)
    {
      return false;
    }

    this.entities.remove(entity, respectOrder);

    this.relations.forEach((relation) =>
    {
      relation.remove(name);

      if (relation.isEmpty())
      {
        this.relations.remove(relation, respectOrder);
      }
    });

    return true;
  }

  public clearEntities()
  {
    this.entities.clear();
  }

  public refactorEntity(entity: string | Entity, transform: Expression, runtime: Runtime): DefinitionsDataTypeReference<EntityType>[]
  {
    const refs = this.getEntityDataReferences(entity);

    refs.forEach((ref) =>
    {
      ref.root.setParent();

      const dataTransform = ref.type.getValueChangeAt(transform);

      ref.data = runtime.run(dataTransform, { value: ref.data });
    });

    return refs;
  }

  public renameRelation(relation: string | Relation, newName: string): false | DefinitionsRelationReference[]
  {
    if (!this.relations.rename(relation, newName))
    {
      return false;
    }

    const refs = this.getRelationReferences(relation);

    refs.forEach((ref) => 
    {
      ref.value.name = newName;
    });

    return refs;
  }

  public renameFunction(func: string | Func, newName: string): false | DefinitionsFunctionReference[]
  {
    if (!this.functions.rename(func, newName))
    {
      return false;
    }

    const refs = this.getFunctionReferences(func);

    refs.forEach((ref) =>
    {
      ref.value.name = newName;
    });

    return refs;
  }

  public renameFunctionParameter(funcInput: string | Func, oldName: string, newName: string): false | DefinitionsFunctionReference[]
  {
    const func = this.functions.get(funcInput);

    if (!func)
    {
      return false;
    }

    func.params.options[newName] = func.params.options[oldName];
    delete func.params.options[oldName];

    if (oldName in func.defaults)
    {
      func.defaults[newName] = func.defaults[oldName];
      delete func.defaults[oldName];
    }

    const refs = this.getFunctionReferences(funcInput, oldName);

    refs.forEach((ref) =>
    {
      ref.value.args[newName] = ref.value.args[oldName];
      delete ref.value.args[oldName];
    });

    return refs;
  }

  public removeFunctionParameter(funcInput: string | Func, name: string): false | DefinitionsFunctionReference[]
  {
    const func = this.functions.get(funcInput);

    if (!func)
    {
      return false;
    }

    delete func.params.options[name];
    delete func.defaults[name];

    const refs = this.getFunctionReferences(funcInput, name);

    refs.forEach((ref) =>
    {
      delete ref.value.args[name];
    });

    return refs;
  }

  public removeFunction(func: string | Func, stopWithReferences: boolean = true, respectOrder: boolean = false): boolean
  {
    if (!this.functions.has(func))
    {
      return true;
    }

    if (stopWithReferences && this.getFunctionReferences(func).length > 0)
    {
      return false;
    }

    this.functions.remove(func, respectOrder);

    return true;
  }

  public clearFunctions()
  {
    this.functions.clear();
  }
  
  public getTypeKind<T extends Type>(value: any, kind: TypeClass<T>, otherwise: T | null = null): T | null 
  {
    const parsed = this.getType(value);

    return parsed instanceof kind ? parsed : otherwise;
  }

  public getType(value: any, otherwise?: Type): Type 
  {
    if (value instanceof Type)
    {
      return value;
    }

    const id = isArray(value) ? value[0] : value;
    const data = isArray(value) ? value : [];
    const parser = this.parsers[id];

    if (!parser)
    {
      if (this.entities.has(id))
      {
        return this.entities.get(id).type;
      }

      if (otherwise)
      {
        return otherwise;
      }
      
      throw new Error(`No parser found for ${id} with payload ${JSON.stringify(data)}`);
    }
    
    return parser(data, this);
  }

  public getBaseTypes(): Type[]
  {
    return this.typeList.map((t) => t.baseType);
  }

  public getSimpleTypes(): Type[]
  {
    return this.getBaseTypes().filter((t) => t.isSimple());
  }

  public getComplexTypes(): Type[]
  {
    return this.getBaseTypes().filter((t) => !t.isSimple());
  }

  public getSimpleTypeClasses(): TypeClass[]
  {
    return this.typeList.filter((t) => t.baseType.isSimple());
  }

  public getComplexTypeClasses(): TypeClass[]
  {
    return this.typeList.filter((t) => !t.baseType.isSimple());
  }

  public getComputed(id: string): Computed | null
  {
    const comp = this.computeds.get(id);

    if (comp)
    {
      return comp;
    }

    const [typeName] = id.split(ID.Delimiter);
    const type = this.types[typeName];

    return type ? type.computeds.get(id) : null;
  }

  public getComputedReturnType(id: string, valueType: Type | null = null): Type | null
  {
    const comp = this.getComputed(id);

    if (!comp)
    {
      return null;
    }

    const op = this.getOperation(comp.op);
    const types = this.getOperationTypes(comp.op);

    if (!op || !types)
    {
      return null;
    }

    return this.getOperationInputType(types.returnType, { [comp.value]: valueType });
  }

  public getComputedsFor(valueType: Type): Computed[]
  {
    const typeClass = this.types[valueType.getId()];

    return typeClass ? typeClass.computeds.list : [];
  }

  public hasComputed(valueType: Type, id: string): boolean
  {
    const typeClass = this.types[valueType.getId()];

    return typeClass ? !!typeClass.computeds.get(id) : false;
  }

  public getOperation(id: string): OperationGeneric | null
  {
    const op = this.operations.get(id);

    if (op)
    {
      return op;
    }

    const [typeName] = id.split(ID.Delimiter);
    const type = this.types[typeName];

    return type ? type.operations.get(id) : null;
  }

  public getOperationTypes(id: string): OperationTypes<any, any, any> | null
  {
    const op = this.operations.getTypes(id);

    if (op)
    {
      return op;
    }

    const [typeName] = id.split(ID.Delimiter);
    const type = this.types[typeName];

    return type ? type.operations.getTypes(id) : null;
  }

  public getOperationReturnType(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type): Type | null
  {
    const op = this.getOperation(id);
    const types = this.getOperationTypes(id);

    if (!op || !types)
    {
      return null;
    }

    const returnType = types.returnType;

    if (returnType instanceof Type)
    {
      return returnType;
    }

    if (!isOperationTypeFunction(returnType))
    {
      return returnType.baseType.newInstance();
    }

    const paramTypes = op.resultDependency.length > 0
      ? this.getOperationParamTypes(id, params, scopeAlias, context, types.rawTypes)
      : {};

    return this.getOperationInputType(types.returnType, paramTypes);
  }

  public getOperationExpectedTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type, rawTypes: boolean = false): TypeMap
  {
    const opTypes = this.getOperationTypes(id);

    if (!opTypes)
    {
      return {};
    }

    const paramTypes = this.getOperationParamTypes(id, params, scopeAlias, context, rawTypes);

    return objectMap(paramTypes, (paramType, name) => this.getOperationInputType(opTypes.params[name] || opTypes.optional[name] || paramType, paramTypes));
  }

  public getOperationParamTypes(id: string, params: ExpressionMap, scopeAlias: Record<string, string>, context: Type, rawTypes: boolean = false): TypeMap
  {
    const types: TypeMap = {};
    const op = this.getOperation(id);
    const opTypes = this.getOperationTypes(id);

    if (!op || !opTypes)
    {
      return types;
    }
    
    for (const param in params)
    {
      if (op.hasScope.indexOf(param) === -1)
      {
        const paramType = params[param].getType(this, context);

        if (paramType)
        {
          types[param] = rawTypes ? paramType : paramType.getSimplifiedType();
        }
      }
    }

    const { context: paramContext, scope: scopeTarget } = this.getContextWithScope(context);
    
    for (const scopeParam of op.scope)
    {
      const scopeType = this.getOperationInputType(opTypes.scope[scopeParam], types);

      if (scopeType)
      {
        const alias = scopeAlias[scopeParam] || scopeParam;

        scopeTarget[alias] = rawTypes ? scopeType : scopeType.getSimplifiedType();
      }
    }

    for (const param in params)
    {
      if (op.hasScope.indexOf(param) !== -1)
      {
        const paramType = params[param].getType(this, paramContext);

        if (paramType)
        {
          types[param] = rawTypes ? paramType : paramType.getSimplifiedType();
        }
      }
    }

    for (const param of op.params)
    {
      if (!types[param])
      {
        types[param] = this.getOperationInputType(opTypes.params[param], types);
      }
    }

    for (const param of op.optional)
    {
      if (!types[param])
      {
        types[param] = this.getOperationInputType(opTypes.optional[param], types);
      }
    }

    return types;
  }

  public getOperationScopeContext(id: string, types: TypeMap, scopeAlias: Record<string, string>, context: Type): Type
  {
    const op = this.getOperation(id);
    const opTypes = this.getOperationTypes(id);
    const { context: scopedContext, scope: scopeTarget } = this.getContextWithScope(context);
    
    for (const scopeParam of op.scope)
    {
      const scopeType = this.getOperationInputType(opTypes.scope[scopeParam], types);

      if (scopeType)
      {
        const alias = scopeAlias[scopeParam] || scopeParam;

        scopeTarget[alias] = scopeType.getSimplifiedType();
      }
    }

    return scopedContext;
  }

  public getContextWithScope(original: Type, scope: TypeMap = {})
  {
    const context = original instanceof ObjectType
      ? new ObjectType({ props: scope = { ...original.options.props, ...scope }})
      : new ManyType([ new ObjectType({ props: scope }), original ]);

    return { context, scope };
  }

  public getContext(original: Type, scope: TypeMap): Type
  {
    return this.getContextWithScope(original, scope).context;
  }

  public getOperationMapping(fromId: string, fromParamTypes: TypeMap, toId: string): OperationMapping | null
  {
    type ParamTuple = [string, Type, number];

    const from = this.getOperation(fromId);
    const fromTypes = this.getOperationTypes(toId);
    const fromVars = from.params.concat(from.optional);
    const to = this.getOperation(toId);
    const toTypes = this.getOperationTypes(toId);
    const mapping: Record<string, string> = Object.create(null);
    const mapped: TypeMap = Object.create(null);
    const getParamTypeTuple = (value: Type, key: string): ParamTuple => 
      [key, value, fromVars.indexOf(key)];
    const paramTypes = objectValues(fromParamTypes, getParamTypeTuple)
      .filter(([,, index]) => index >= 0)
      .sort(([,, a], [,, b]) => a - b);

    const getParamTuple = (param: string, typeInput: OperationTypeInput<any>): ParamTuple | null => 
    {
      if (paramTypes.length === 0)
      {
        return null;
      }

      let chosenIndex = -1;

      if (isOperationTypeFunction(typeInput))
      {
        chosenIndex = paramTypes.findIndex(([, type]) => 
          type.acceptsType(Types.parse(typeInput({ ...mapped, [param]: type }, this))));
        
        if (chosenIndex === -1)
        {
          chosenIndex = paramTypes.findIndex(([, type]) =>
            Types.parse(typeInput({ ...mapped, [param]: type}, this)).acceptsType(type));
        }
      }
      else
      {
        const paramType = Types.parse(typeInput);

        chosenIndex = paramTypes.findIndex(([, type]) => paramType.acceptsType(type));
      }

      if (chosenIndex === -1)
      {
        return null;
      }

      const chosen = paramTypes[chosenIndex];
      paramTypes.splice(chosenIndex, 1);
      mapping[chosen[0]] = param;
      mapped[param] = chosen[1];
    };
    
    for (const param of to.params)
    {
      const tuple = getParamTuple(param, toTypes.params[param]);

      if (tuple === null)
      {
        return null;
      }
    }

    for (const optional of to.optional)
    {
      getParamTuple(optional, toTypes.optional[optional]);
    }

    const unmapped = paramTypes.map(([key]) => key);
    
    return { from, fromTypes, to, toTypes, mapping, unmapped };
  }

  public getOperationInputType(input: OperationTypeInput<any>): Type | null
  public getOperationInputType(input: OperationTypeInput<any>, params: TypeMap): Type
  public getOperationInputType(input: OperationTypeInput<any>, params?: TypeMap): Type
  {
    return input instanceof Type
      ? input
      : 'baseType' in input
        ? input.baseType.clone()
        : params
          ? Types.parse(input(params, this))
          : null;
  }

  public getOperationsForExpression(expr: Expression, context: Type): OperationPair[]
  {
    const type = expr.getType(this, context);

    return type ? this.getOperationsForType(type.getSimplifiedType()) : [];
  }

  public getOperationsWithMapping(fromId: string, fromParamTypes: TypeMap): OperationMapping[]
  {
    return this.getOperations()
      .map(({ op }) => this.getOperationMapping(fromId, fromParamTypes, op.id))
      .filter((mapping) => !!mapping);
  }

  public getOperationsForType(type: Type, acceptsDynamic: boolean = false): OperationPair[]
  {
    return this.getOperations(({ op, types }) => 
    {
      const paramName = op.params[0];
      const opTypeInput = types.params[paramName];

      if (opTypeInput) 
      {
        const opType = this.getOperationInputType(opTypeInput, { [paramName]: type });

        if (opType)
        {
          if (type.acceptsType(opType))
          {
            return true;
          }

          if (acceptsDynamic && 
            op.resultDependency.length > 0 && 
            isOperationTypeFunction(types.returnType) && 
            (opType instanceof AnyType || opType instanceof NullType))
          {
            return true;
          }
        }
      }

      return false;
    });
  }

  public getOperationsWithReturnExpression(expr: Expression, context: Type, paramTypes: TypeMap = {}, acceptsDynamic: boolean = false): OperationPair[]
  {
    const type = expr.getType(this, context);

    return type ? this.getOperationsWithReturnType(type.getSimplifiedType(), paramTypes, acceptsDynamic) : [];
  }

  public getOperationsWithReturnType(type: Type, paramTypes: TypeMap = {}, acceptsDynamic: boolean = false): OperationPair[]
  {
    return this.getOperations(({ op, types }) =>
    {
      const returnType = this.getOperationInputType(types.returnType, paramTypes);

      if (returnType)
      {
        if (type.acceptsType(returnType))
        {
          return true;
        }

        if (acceptsDynamic && 
          op.resultDependency.length > 0 && 
          isOperationTypeFunction(types.returnType) && 
          (returnType instanceof AnyType || returnType instanceof NullType))
        {
          return true;
        }
      }      

      return false;
    });
  }

  public getOperationsForParamExpressions(params: ExpressionMap, context: Type): OperationPair[]
  {
    return this.getOperationsForParamTypes(objectMap(params, expr => 
    {
      const type = expr.getType(this, context);

      return type ? type.getSimplifiedType() : undefined;
    }));
  }

  public getOperationsForParamTypes(paramTypes: TypeMap): OperationPair[]
  {
    const paramNames = Object.keys(paramTypes);

    return this.getOperations(({ types }) => 
    {
      for (const param of paramNames)
      {
        const opTypeInput = types.params[param] || types.optional[param];

        if (!opTypeInput)
        {
          return false;
        }

        const opType = this.getOperationInputType(opTypeInput, paramTypes);

        if (!opType || !paramTypes[param].acceptsType(opType))
        {
          return false;
        }
      }

      return true;
    });
  }

  public getOperations(onOperation: <P extends string, O extends string, S extends string>(pair: OperationPair<P, O, S>) => boolean = () => true): OperationPair[]
  {
    const ops: OperationPair[] = [];

    const iterateOperations = (operations: Operations) => 
    {
      const map = operations.map;

      for (const id in map)
      {
        const op = map[id];
        const types = operations.types[id];
        const pair = { op, types };

        if (onOperation(pair))
        {
          ops.push(pair);
        }
      }
    };

    iterateOperations(this.operations);

    objectEach(this.types, t => iterateOperations(t.operations));

    return ops;
  }

  public getPathType(path: Expression[], context: Type, stopBefore: number = path.length): Type | null
  {
    let optional = false;
    let node = context;

    for (let i = 0; i < stopBefore; i++)
    {
      node = node.getSubType(path[i], this, context);

      if (!node)
      {
        return null;
      }

      optional = optional || node.isOptional();
    }

    return optional && !node.isOptional() ? Types.optional(node) : node;
  }

  public addExpression<T extends Expression>(expr: ExpressionClass<T>) 
  {
    this.expressions[expr.id] = expr;
  }

  public getExpression(value: any): Expression 
  {
    if (value instanceof Expression)
    {
      return value;
    }
    else if (isArray(value))
    {
      const exprClass = this.expressions[value[0]];

      if (!exprClass)
      {
        throw new Error('An expression was not found for: ' + JSON.stringify(value));
      }

      return exprClass.decode(value, this);
    }

    return new ConstantExpression(value);
  }

  public getEntityReferences(entity?: string | Entity): DefinitionsEntityReference[]
  { 
    const name = entity ? this.entities.nameOf(entity) : undefined;

    const types = this.getTypeClassReferences(EntityType).filter((match) => {
      return (!name || name === match.value.options);
    });

    const exprs = this.getExpressionClassReferences(GetEntityExpression).filter((match) => {
      return (!name || name === match.value.name);
    });

    return (types as DefinitionsEntityReference[]).concat(exprs);
  }

  public getDataReferences(data?: string | ReferenceData): DefinitionsDataReference[]
  {
    const name = data ? this.data.nameOf(data) : undefined;

    const types = this.getTypeClassReferences(ReferenceType).filter((match) => {
      return (!name || name === match.value.options);
    });

    const exprs = this.getExpressionClassReferences(GetDataExpression).filter((match) => {
      return (!name || name === match.value.name);
    });

    return (types as DefinitionsDataReference[]).concat(exprs);
  }

  public getEntityDataReferences(entity?: string | Entity): DefinitionsDataTypeReference<EntityType>[]
  {
    const name = entity ? this.entities.nameOf(entity) : undefined;

    return this.getDataTypeClassReferences(EntityType).filter((match) => {
      return (!name || name === match.type.options);
    });
  }

  public getRelationReferences(relation?: string | Relation): DefinitionsRelationReference[]
  {
    const name = relation ? this.relations.nameOf(relation) : undefined;

    return this.getExpressionClassReferences(GetRelationExpression).filter((match) => {
      return (!name || name === match.value.name);
    });
  }

  public getFunctionReferences(func?: string | Func, param?: string): DefinitionsFunctionReference[]
  {
    const name = func ? this.functions.nameOf(func) : undefined;

    return this.getExpressionClassReferences(InvokeExpression).filter((match) => {
      return (!name || name === match.value.name) && (!param || param in match.value.args);
    });
  }

  public getTypeClassReferences<T extends Type>(typeClass: TypeClass<T>): DefinitionsTypeReference<T>[]
  {
    const refs: DefinitionsTypeReference<T>[] = [];

    this.getTypeInstances().forEach((instance) => {
      instance.type.traverse(new Traverser((ref) => {
        if (ref instanceof typeClass) {
          refs.push({
            value: ref, 
            root: instance.type,
            source: instance.source,
          });
        }
      }));
    });

    return refs;
  }

  public getDataTypeClassReferences<T extends Type>(typeClass: TypeClass<T>): DefinitionsDataTypeReference<T>[]
  {
    const refs: DefinitionsDataTypeReference<T>[] = [];

    this.getDataInstances().forEach((instance) => {
      instance.type.traverse(new Traverser((type) => {
        if (type instanceof typeClass) {
          refs.push({
            type, 
            data: instance.data,
            root: instance.type,
            source: instance.source,
          });
        }
      }));
    });

    return refs;
  }

  public getExpressionClassReferences<E extends Expression>(exprClass: ExpressionClass<E>): DefinitionsExpressionReference<E>[]
  {
    const refs: DefinitionsExpressionReference<E>[] = [];

    this.getExpressionInstances().forEach((instance) => {
      instance.expr.traverse(new Traverser((ref) => {
        if (ref instanceof exprClass) {
          refs.push({
            value: ref, 
            root: instance.expr,
            source: instance.source,
          });
        }
      }));
    });

    return refs;
  }

  public getDataInstances(): DefinitionsDataInstance[]
  {
    const instances: DefinitionsDataInstance[] = [];


    this.programs.forEach((program) => {
      program.datasets.forEach((dataset) => {
        instances.push({
          data: dataset.data,
          type: program.dataType,
          source: [program, dataset],
        });
      });
    });

    this.functions.forEach((func) => {
      const returnType = func.getReturnType(this);

      func.tests.forEach((test) => {
        instances.push({
          data: test.args,
          type: func.params,
          source: [func, test, 'args'],
        });

        instances.push({
          data: test.expected,
          type: returnType,
          source: [func, test, 'expected'],
        });
      });
    });

    this.data.forEach((data) => {
      instances.push({
        data: data.data,
        type: data.dataType,
        source: data,
      });
    });

    this.entities.forEach((entity) => {
      if (entity.instances && entity.instances.length > 0) {
        instances.push({
          data: entity.instances,
          type: Types.list(entity.type),
          source: entity,
        });
      }

      objectEach(entity.methods, (method) => {
        const returnType = method.getReturnType(this);

        method.tests.forEach((test) => {
          instances.push({
            data: test.args,
            type: method.params,
            source: [entity, method, test, 'args'],
          });

          instances.push({
            data: test.expected,
            type: returnType,
            source: [entity, method, test, 'expected'],
          });
        });
      });
    });

    return instances;
  }

  public getTypeInstances(dynamic: boolean = false): DefinitionsTypeInstance[]
  {
    const instances: DefinitionsTypeInstance[] = [];

    this.programs.forEach((program) => {
      instances.push({
        type: program.dataType,
        source: program,
      });
    });

    this.functions.forEach((func) => {
      instances.push({
        type: func.params,
        source: [func, 'params'],
      });

      if (dynamic) {
        instances.push({
          type: func.getReturnType(this),
          source: [func, 'returnType'],
        });
      }
    });

    this.data.forEach((data) => {
      instances.push({
        type: data.dataType,
        source: data,
      });
    });

    this.entities.forEach((entity) => {
      instances.push({
        type: entity.type,
        source: entity,
      });

      objectEach(entity.methods, (method) => {
        instances.push({
          type: method.params,
          source: [entity, method, 'params'],
        });

        if (dynamic) {
          instances.push({
            type: method.getReturnType(this),
            source: [entity, method, 'returnType'],
          });
        }
      });

      if (dynamic) {
        if (entity.key !== NoExpression.instance) {
          instances.push({
            type: entity.getKeyContext(),
            source: [entity, 'key'],
          });
        }
        
        if (entity.describe !== NoExpression.instance) {
          instances.push({
            type: entity.getDescribeContext(),
            source: [entity, 'describe'],
          });
        }
      }

      objectEach(entity.transcoders, (transcoder, prop) => {
        instances.push({
          type: transcoder.encodedType,
          source: [entity, prop, transcoder],
        });
      });
    });

    if (dynamic) {
      this.relations.forEach((relation) => {
        if (relation.morphs) {
          instances.push({
            type: relation.morphs[1],
            source: relation,
          });
        }
      });
    }

    return instances;
  }

  public getExpressionInstances(): DefinitionsExpressionInstance[]
  {
    const instances: DefinitionsExpressionInstance[] = [];

    this.programs.forEach((program) => {
      instances.push({
        context: program.dataType,
        expr: program.expression,
        source: program,
      });
    });

    this.functions.forEach((func) => {
      instances.push({
        context: func.params,
        expr: func.expression,
        source: func,
      });
    });

    this.entities.forEach((entity) => {
      objectEach(entity.methods, (method) => {
        instances.push({
          context: method.getParamTypes(),
          expr: method.expression,
          source: [entity, method],
        });
      });

      if (entity.canStore(this)) {
        instances.push({
          context: entity.getKeyContext(),
          expr: entity.key,
          source: [entity, 'key'],
        });

        instances.push({
          context: entity.getDescribeContext(),
          expr: entity.describe,
          source: [entity, 'describe'],
        });

        objectEach(entity.transcoders, (transcoder, prop) => {
          instances.push({
            context: entity.getEncodeContext(prop),
            expr: transcoder.encode,
            source: [entity, prop, transcoder, 'encode'],
          });

          instances.push({
            context: entity.getDecodeContext(prop),
            expr: transcoder.decode,
            source: [entity, prop, transcoder, 'decode'],
          });
        });
      }
    });

    return instances;
  }

  public export(): DefinitionsImportOptions
  {
    return {
      entities: this.encodeMap(this.entities),
      functions: this.encodeMap(this.functions),
      relations: this.encodeMap(this.relations),
      programs: this.encodeMap(this.programs),
      data: this.encodeMap(this.data),
    };
  }

  public import(exported: DefinitionsImportOptions): void
  {
    if (exported.entities) 
    {
      objectEach(exported.entities, (instance) => 
        this.addEntity(instance)
      );
    }

    if (exported.functions)
    {
      objectEach(exported.functions, (func) => 
        this.addFunction(func)
      );
    }

    if (exported.programs)
    {
      objectEach(exported.programs, (options) => 
        this.addProgram(options)
      );
    }

    if (exported.relations)
    {
      objectEach(exported.relations, (options) => 
        this.addRelation(options)
      );
    }

    if (exported.data)
    {
      objectEach(exported.data, (data) => 
        this.addData(data)
      );
    }
  }

}