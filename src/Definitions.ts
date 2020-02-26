
import { isArray, objectMap, objectValues, objectEach, isString } from './fns';
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
  public relations: Record<string, Relation>;
  public programs: Record<string, Program>;
  public entities: Record<string, Entity>;
  public functions: Record<string, Func>;
  public data: Record<string, ReferenceData>;

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
    this.entities = Object.create(null);
    this.functions = Object.create(null);
    this.relations = Object.create(null);
    this.programs = Object.create(null);
    this.data = Object.create(null);

    this.keyExpectedType = Types.many(Types.text(), Types.number());
    this.describeExpectedType = Types.text();

    if (initial) 
    {
      this.add(initial);
    }
  }

  public extend(deepCopy: boolean = false, initial?: DefinitionsOptions): Definitions
  { 
    const copy = new Definitions({
      types: objectValues(this.types),
      expressions: objectValues(this.expressions),
      entities: objectMap(this.entities, a => deepCopy ? a.encode() : a),
      functions: objectMap(this.functions, f => deepCopy ? f.encode() : f),
      relations: objectMap(this.relations, r => r.encode()),
      programs: objectMap(this.programs, p => deepCopy ? p.encode() : p),
      data: objectMap(this.data, d => deepCopy ? d.encode() : d),
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
    for (const entityName in this.entities)
    {
      const entity = this.entities[entityName];

      if (entity.type.isCompatible(type, options))
      {
        return entityName;
      }
    }

    return false;
  }

  public addData(data: ReferenceData | Partial<ReferenceDataOptions>): this
  {
    this.data[data.name] = data instanceof ReferenceData
      ? data
      : ReferenceData.create(this, data);

    return this;
  }

  public getData(name: string): ReferenceData | null
  {
    return this.data[name] || null;
  }

  public removeData(data: string | ReferenceData, stopWithReferences: boolean = true): boolean
  {
    const name = isString(data) ? data : data.name;

    if (!(name in this.data))
    {
      return true;
    }

    if (stopWithReferences && this.getDataReferences(name).length > 0)
    {
      return false;
    }

    delete this.data[name];

    return true;
  }

  public renameData(name: string, newName: string): false | DefinitionsDataReference[]
  {
    const data = this.data[name];

    if (name === newName || !newName || !data)
    {
      return false;
    }

    data.name = name;

    this.data[newName] = data;
    
    delete this.data[name];

    const refs = this.getDataReferences(name);

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
    this.functions[func.name] = func instanceof Func
      ? func
      : Func.create(this, func);

    return this;
  }

  public getFunction(name: string): Func | null
  {
    return this.functions[name] || null;
  }  

  public addProgram(program: Program | Partial<ProgramOptions>): this
  {
    this.programs[program.name] = program instanceof Program
      ? program
      : Program.create(this, program);

    return this;
  }

  public getProgram(name: string): Program
  {
    return this.programs[name];
  }

  public removeProgram(program: string | Program): boolean
  {
    const name = isString(program) ? program : program.name;

    if (!(name in this.programs))
    {
      return true;
    }

    delete this.programs[name];

    return true;
  }
  
  public addEntity(entity: Entity | Partial<EntityOptions>): this
  {
    this.entities[entity.name] = entity instanceof Entity
      ? entity
      : Entity.create(this, entity);

    return this;
  }

  public getEntity(name: string): Entity | null
  {
    return this.entities[name] || null;
  }

  public getEntities(): Record<string, Entity>
  {
    return this.entities;
  }

  public addRelation(relation: Relation | RelationOptions): this
  {
    this.relations[relation.name] = relation instanceof Relation
      ? relation
      : new Relation(this, relation);

    return this;
  }

  public getRelation(name: string)
  {
    return this.relations[name];
  }

  public getRelations(entityName: string): EntityRelation[]
  {
    const relations: EntityRelation[] = [];

    objectEach(this.relations, (relation) =>
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
    const entity = this.entities[name];

    if (entity)
    {
      keys.push(entity.getEntityProps());

      objectEach(this.relations, (relation) =>
      {
        keys.push(...relation.getTypeProps(name));
      });
    }

    return keys;
  }

  public removeRelation(relation: string | Relation, stopWithReferences: boolean = true): boolean
  {
    const name = isString(relation) ? relation : relation.name;

    if (!(name in this.relations))
    {
      return true;
    }

    if (stopWithReferences && this.getRelationReferences(name).length > 0)
    {
      return false;
    }

    delete this.relations[name];

    return true;
  }

  public renameProgram(name: string, newName: string): boolean
  {
    const program = this.programs[name];

    if (!program)
    {
      return false;
    }

    program.name = newName;

    this.programs[newName] = program;

    delete this.programs[name];

    return true;
  }

  public renameEntity(name: string, newName: string): false | DefinitionsEntityReference[]
  {
    const entity = this.entities[name];

    if (name === newName || !newName || !entity)
    {
      return false;
    }

    entity.name = name;

    this.entities[newName] = entity;
    
    delete this.entities[name];

    objectEach(this.relations, (relation) => 
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

  public renameEntityProp(name: string, prop: string, newProp: string)
  {
    const entity = this.entities[name];

    if (entity)
    {
      entity.renameProp(prop, newProp);

      objectEach(this.relations, (relation) =>
      {
        relation.renameProp(name, prop, newProp);
      });
    }
  }

  public removeEntityProp(name: string, prop: string)
  {
    const entity = this.entities[name];

    if (entity)
    {
      entity.removeProp(prop);

      objectEach(this.relations, (relation, relationName) =>
      {
        relation.removeProp(name, prop);

        if (relation.isEmpty())
        {
          delete this.relations[relationName];
        }
      });
    } 
  }

  public removeEntity(entity: string | Entity, stopWithReferences: boolean = true): boolean
  {
    const name = isString(entity) ? entity : entity.name;

    if (!(name in this.entities))
    {
      return true;
    }

    if (stopWithReferences && this.getEntityReferences(name).length > 0)
    {
      return false;
    }

    delete this.entities[name];

    objectEach(this.relations, (relation, relationName) =>
    {
      relation.remove(name);

      if (relation.isEmpty())
      {
        delete this.relations[relationName];
      }
    });

    return true;
  }

  public refactorEntity(name: string, transform: Expression, runtime: Runtime): DefinitionsDataTypeReference<EntityType>[]
  {
    const refs = this.getEntityDataReferences();

    refs.forEach((ref) =>
    {
      ref.root.setParent();

      const dataTransform = ref.type.getValueChangeAt(transform);

      ref.data = runtime.run(dataTransform, { value: ref.data });
    });

    return refs;
  }

  public renameRelation(oldName: string, newName: string): false | DefinitionsRelationReference[]
  {
    const relation = this.relations[oldName];

    if (!relation)
    {
      return false;
    }

    relation.name = newName;

    this.relations[newName] = relation;

    delete this.relations[oldName];

    const refs = this.getRelationReferences(oldName);

    refs.forEach((ref) => 
    {
      ref.value.name = newName;
    });

    return refs;
  }

  public renameFunction(oldName: string, newName: string): false | DefinitionsFunctionReference[]
  {
    const func = this.functions[oldName];

    if (!func)
    {
      return false;
    }

    func.name = newName;

    this.functions[newName] = func;

    delete this.functions[oldName];

    const refs = this.getFunctionReferences(oldName);

    refs.forEach((ref) =>
    {
      ref.value.name = newName;
    });

    return refs;
  }

  public renameFunctionParameter(functionName: string, oldName: string, newName: string): false | DefinitionsFunctionReference[]
  {
    const func = this.functions[functionName];

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

    const refs = this.getFunctionReferences(functionName, oldName);

    refs.forEach((ref) =>
    {
      ref.value.args[newName] = ref.value.args[oldName];
      delete ref.value.args[oldName];
    });

    return refs;
  }

  public removeFunctionParameter(functionName: string, name: string): false | DefinitionsFunctionReference[]
  {
    const func = this.functions[functionName];

    if (!func)
    {
      return false;
    }

    delete func.params.options[name];
    delete func.defaults[name];

    const refs = this.getFunctionReferences(functionName, name);

    refs.forEach((ref) =>
    {
      delete ref.value.args[name];
    });

    return refs;
  }

  public removeFunction(func: string | Func, stopWithReferences: boolean = true): boolean
  {
    const name = isString(func) ? func : func.name;

    if (!(name in this.entities))
    {
      return true;
    }

    if (stopWithReferences && this.getFunctionReferences(name).length > 0)
    {
      return false;
    }

    delete this.functions[name];

    return true;
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
      if (id in this.entities)
      {
        return this.entities[id].type;
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

  public getEntityReferences(name?: string): DefinitionsEntityReference[]
  {
    const types = this.getTypeClassReferences(EntityType).filter((match) => {
      return (!name || name === match.value.options);
    });

    const exprs = this.getExpressionClassReferences(GetEntityExpression).filter((match) => {
      return (!name || name === match.value.name);
    });

    return (types as DefinitionsEntityReference[]).concat(exprs);
  }

  public getDataReferences(name?: string): DefinitionsDataReference[]
  {
    const types = this.getTypeClassReferences(ReferenceType).filter((match) => {
      return (!name || name === match.value.options);
    });

    const exprs = this.getExpressionClassReferences(GetDataExpression).filter((match) => {
      return (!name || name === match.value.name);
    });

    return (types as DefinitionsDataReference[]).concat(exprs);
  }

  public getEntityDataReferences(name?: string): DefinitionsDataTypeReference<EntityType>[]
  {
    return this.getDataTypeClassReferences(EntityType).filter((match) => {
      return (!name || name === match.type.options);
    });
  }

  public getRelationReferences(relation?: string): DefinitionsRelationReference[]
  {
    return this.getExpressionClassReferences(GetRelationExpression).filter((match) => {
      return (!relation || relation === match.value.name);
    });
  }

  public getFunctionReferences(name?: string, param?: string): DefinitionsFunctionReference[]
  {
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

    objectEach(this.programs, (program) => {
      program.datasets.forEach((dataset) => {
        instances.push({
          data: dataset.data,
          type: program.dataType,
          source: [program, dataset],
        });
      });
    });

    objectEach(this.functions, (func) => {
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

    objectEach(this.data, (data) => {
      instances.push({
        data: data.data,
        type: data.dataType,
        source: data,
      });
    });

    objectEach(this.entities, (entity) => {
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

    objectEach(this.programs, (program) => {
      instances.push({
        type: program.dataType,
        source: program,
      });
    });

    objectEach(this.functions, (func) => {
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

    objectEach(this.data, (data) => {
      instances.push({
        type: data.dataType,
        source: data,
      });
    });

    objectEach(this.entities, (entity) => {
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
      objectEach(this.relations, (relation) => {
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

    objectEach(this.programs, (program) => {
      instances.push({
        context: program.dataType,
        expr: program.expression,
        source: program,
      });
    });

    objectEach(this.functions, (func) => {
      instances.push({
        context: func.params,
        expr: func.expression,
        source: func,
      });
    });

    objectEach(this.entities, (entity) => {
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
      entities: objectMap(this.entities, e => e.encode()),
      functions: objectMap(this.functions, f => f.encode()),
      relations: objectMap(this.relations, r => r.encode()),
      programs: objectMap(this.programs, p => p.encode()),
      data: objectMap(this.data, d => d.encode()),
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