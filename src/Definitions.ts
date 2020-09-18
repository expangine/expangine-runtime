
import { isArray, isString, objectMap, objectValues, objectEach } from './fns';
import { Type, TypeClass, TypeParser, TypeMap, TypeCompatibleOptions, TypeDescribeProvider } from './Type';
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
import { MethodExpression } from './exprs/Method';
import { GetRelationExpression } from './exprs/GetRelation';
import { Runtime } from './Runtime';
import { DefinitionProvider } from './DefinitionProvider';
import { ReferenceDataOptions, ReferenceData } from './ReferenceData';
import { GetDataExpression } from './exprs/GetData';
import { ReferenceType } from './types/Reference';
import { NamedMap } from './maps/NamedMap';
import { FastMap } from './maps/FastMap';
import { EventBase } from './EventBase';
import { DataTypes } from './DataTypes';



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

export interface DefinitionsEvents
{
  changed(defs: Definitions): void;
  sync(defs: Definitions, options: DefinitionsOptions): void;

  addRelation(defs: Definitions, relation: Relation): void;
  removeRelation(defs: Definitions, relation: Relation): void;
  updateRelation(defs: Definitions, relation: Relation): void;
  renameRelation(defs: Definitions, relation: Relation, oldName: string): void;
  clearRelations(defs: Definitions, relations: Relation[]): void;
  changedRelations(defs: Definitions): void;
  
  addProgram(defs: Definitions, program: Program): void;
  removeProgram(defs: Definitions, program: Program): void;
  updateProgram(defs: Definitions, program: Program): void;
  renameProgram(defs: Definitions, program: Program, oldName: string): void;
  clearPrograms(defs: Definitions, programs: Program[]): void;
  changedPrograms(defs: Definitions): void;
  
  addEntity(defs: Definitions, entity: Entity): void;
  removeEntity(defs: Definitions, entity: Entity): void;
  updateEntity(defs: Definitions, entity: Entity): void;
  renameEntity(defs: Definitions, entity: Entity, oldName: string): void;
  clearEntities(defs: Definitions, entities: Entity[]): void;
  changedEntities(defs: Definitions): void;
  
  addFunction(defs: Definitions, func: Func): void;
  removeFunction(defs: Definitions, func: Func): void;
  updateFunction(defs: Definitions, func: Func): void;
  renameFunction(defs: Definitions, func: Func, oldName: string): void;
  clearFunctions(defs: Definitions, functions: Func[]): void;
  changedFunctions(defs: Definitions): void;

  addMethod(defs: Definitions, method: Func, entity: Entity): void;
  removeMethod(defs: Definitions, method: Func, entity: Entity): void;
  updateMethod(defs: Definitions, method: Func, entity: Entity): void;
  renameMethod(defs: Definitions, method: Func, entity: Entity, oldName: string): void;
  changedMethods(defs: Definitions): void;
  
  addData(defs: Definitions, data: ReferenceData): void;
  removeData(defs: Definitions, data: ReferenceData): void;
  updateData(defs: Definitions, data: ReferenceData): void;
  renameData(defs: Definitions, data: ReferenceData, oldName: string): void;
  clearData(defs: Definitions, data: ReferenceData[]): void;
  changedData(defs: Definitions): void;
}

export class Definitions extends EventBase<DefinitionsEvents> implements OperationTypeProvider, DefinitionProvider
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

  private legacy: boolean = false;

  public constructor(initial?: DefinitionsOptions)
  { 
    super();

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

  public isLegacy(): boolean
  {
    return this.legacy;
  }

  public setLegacy(): void
  {
    this.legacy = true;
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
  
  public changed()
  {
    this.trigger('changed', this);
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

  public describe(completeData: any): Type
  {
    const described: Map<any, any> = new Map();

    const provider: TypeDescribeProvider = 
    {
      describe: (data) => 
      {
        let describedType = described.get(data);

        if (describedType !== undefined) 
        {
          return describedType;
        }

        for (const describer of this.describers)
        {
          describedType = describer.describe(data, provider, described);
    
          if (describedType)
          {
            return describedType;
          }
        }

        return AnyType.baseType;
      },
      merge: (type, data) => 
      {
        return this.merge(type, data);
      },
    };

    return provider.describe(completeData);
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

  public addData(dataOptions: ReferenceData | Partial<ReferenceDataOptions>, sync: boolean = true, delayChange: boolean = false): this
  {
    const data = dataOptions instanceof ReferenceData 
      ? dataOptions 
      : ReferenceData.create(this, dataOptions);

    const existing = this.data.get(data.name);

    if (existing)
    {
      if (sync)
      {
        existing.sync(data, this);
      }
      else
      {
        this.data.add(data);
      }
      
      this.trigger('updateData', this, data);
    }
    else
    {
      this.data.add(data);

      this.trigger('addData', this, data);
    }

    this.trigger('changedData', this);

    if (!delayChange)
    {
      this.changed();
    }

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

  public removeData(dataInput: string | ReferenceData, stopWithReferences: boolean = true, respectOrder: boolean = false, delayChange: boolean = false): boolean
  {
    const data = this.data.valueOf(dataInput);

    if (!data)
    {
      return true;
    }

    if (stopWithReferences && this.getDataReferences(data).length > 0)
    {
      return false;
    }

    this.data.remove(data, respectOrder);

    this.trigger('removeData', this, data);
    this.trigger('changedData', this);

    if (!delayChange)
    {
      this.changed();
    }

    return true;
  }

  public clearData(delayChange: boolean = false)
  {
    const data = this.data.values.slice();

    this.data.clear();

    this.trigger('clearData', this, data);
    this.trigger('changedData', this);

    if (!delayChange)
    {
      this.changed();
    }
  }

  public renameData(dataInput: string | ReferenceData, newName: string, delayChange: boolean = false): false | DefinitionsDataReference[]
  {
    const data = this.data.valueOf(dataInput);
    const oldName = data.name;
    
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

    data.trigger('renamed', data, oldName);
    data.changed();

    this.trigger('renameData', this, data, oldName);
    this.trigger('changedData', this);

    if (!delayChange)
    {
      this.changed();
    }

    return refs;
  }

  public addFunction(funcOptions: Func | Partial<FuncOptions>, sync: boolean = true, delayChange: boolean = false): this
  {
    const func = funcOptions instanceof Func 
      ? funcOptions 
      : Func.create(this, funcOptions);

    const existing = this.functions.get(func.name);

    if (existing)
    {
      if (sync)
      {
        existing.sync(func, this);
      }
      else
      {
        this.functions.add(func);
      }
      
      this.trigger('updateFunction', this, func);
    }
    else
    {
      this.functions.add(func);

      this.trigger('addFunction', this, func);
    }

    this.trigger('changedFunctions', this);

    if (!delayChange)
    {
      this.changed();
    }

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

  public addProgram(programOptions: Program | Partial<ProgramOptions>, sync: boolean = true, delayChange: boolean = false): this
  {
    const program = programOptions instanceof Program 
      ? programOptions 
      : Program.create(this, programOptions);

    const existing = this.programs.get(program.name);

    if (existing)
    {
      if (sync)
      {
        existing.sync(program, this);
      }
      else
      {
        this.programs.add(program);
      }
      
      this.trigger('updateProgram', this, program);
    }
    else
    {
      this.programs.add(program);

      this.trigger('addProgram', this, program);
    }

    this.trigger('changedPrograms', this);

    if (!delayChange)
    {
      this.changed();
    }

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

  public removeProgram(programInput: string | Program, respectOrder: boolean = false, delayChange: boolean = false): boolean
  {
    const program = this.programs.valueOf(programInput);

    if (!program)
    {
      return true;
    }

    this.programs.remove(program, respectOrder);

    this.trigger('removeProgram', this, program);
    this.trigger('changedPrograms', this);

    if (!delayChange)
    {
      this.changed();
    }

    return true;
  }

  public clearPrograms(delayChange: boolean = false)
  {
    const programs = this.programs.values.slice();

    this.programs.clear();

    this.trigger('clearPrograms', this, programs);
    this.trigger('changedPrograms', this);

    if (!delayChange)
    {
      this.changed();
    }
  }
  
  public addEntity(entityOptions: Entity | Partial<EntityOptions>, sync: boolean = true, delayChange: boolean = false): this
  {
    const entity = entityOptions instanceof Entity
      ? entityOptions
      : Entity.create(this, entityOptions);

    const existing = this.entities.get(entity.name);

    if (existing)
    {
      if (sync)
      {
        existing.sync(entity, this);
      }
      else
      {
        this.entities.add(entity);
      }
      
      this.trigger('updateEntity', this, entity);
    }
    else
    {
      this.entities.add(entity);

      this.trigger('addEntity', this, entity);
    }

    this.trigger('changedEntities', this);

    if (!delayChange)
    {
      this.changed();
    }

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

  public addRelation(relationOptions: Relation | RelationOptions, sync: boolean = true, delayChange: boolean = false): this
  {
    const relation = relationOptions instanceof Relation 
      ? relationOptions 
      : new Relation(this, relationOptions);

    const existing = this.relations.get(relation.name);

    if (existing)
    {
      if (sync)
      {
        existing.sync(relation, this);
      }
      else
      {
        this.relations.add(relation);
      }
      
      this.trigger('updateRelation', this, relation);
    }
    else
    {
      this.relations.add(relation);

      this.trigger('addRelation', this, relation);
    }

    this.trigger('changedRelations', this);

    if (!delayChange)
    {
      this.changed();
    }

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

  public removeRelation(relationInput: string | Relation, stopWithReferences: boolean = true, respectOrder: boolean = false, delayChange: boolean = false): boolean
  {
    const relation = this.relations.valueOf(relationInput);

    if (!relation)
    {
      return true;
    }

    if (stopWithReferences && this.getRelationReferences(relation).length > 0)
    {
      return false;
    }

    this.relations.remove(relation, respectOrder);

    this.trigger('removeRelation', this, relation);
    this.trigger('changedRelations', this);

    if (!delayChange)
    {
      this.changed();
    }

    return true;
  }

  public clearRelations(delayChange: boolean = false)
  {
    const relations = this.relations.values.slice();

    this.relations.clear();

    this.trigger('clearRelations', this, relations);
    this.trigger('changedRelations', this);

    if (!delayChange)
    {
      this.changed();
    }
  }

  public renameProgram(programInput: string | Program, newName: string, delayChange: boolean = false): boolean
  {
    const program = this.programs.valueOf(programInput);
    const oldName = program.name;

    if (!this.programs.rename(program, newName))
    {
      return false;
    }

    program.trigger('renamed', program, oldName);
    program.changed();

    this.trigger('renameProgram', this, program, oldName);
    this.trigger('changedPrograms', this);

    if (!delayChange)
    {
      this.changed();
    }
    
    return true;
  }

  public renameEntity(entityInput: string | Entity, newName: string, delayChange: boolean = false): false | DefinitionsEntityReference[]
  {
    const entity = this.entities.valueOf(entityInput);
    const oldName = entity.name;

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

    const methods = this.getMethodReferences(name);

    methods.forEach((ref) =>
    {
      ref.value.name = newName;
    });

    entity.trigger('renamed', entity, oldName);
    entity.changed();

    this.trigger('renameEntity', this, entity, oldName);
    this.trigger('changedEntities', this);

    if (!delayChange)
    {
      this.changed();
    }

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

  public removeEntity(entityInput: string | Entity, stopWithReferences: boolean = true, respectOrder: boolean = false, delayChange: boolean = false): boolean
  {
    const entity = this.entities.valueOf(entityInput);

    if (!entity)
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

    this.trigger('removeEntity', this, entity);
    this.trigger('changedEntities', this);

    if (!delayChange)
    {
      this.changed();
    }


    return true;
  }

  public clearEntities(delayChange: boolean = false)
  {
    const entities = this.entities.values.slice();

    this.entities.clear();

    this.trigger('clearEntities', this, entities);
    this.trigger('changedEntities', this);

    if (!delayChange)
    {
      this.changed();
    }
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

  public renameRelation(relationInput: string | Relation, newName: string, delayChange: boolean = false): false | DefinitionsRelationReference[]
  {
    const relation = this.relations.valueOf(relationInput);
    const oldName = relation.name;

    if (!this.relations.rename(relation, newName))
    {
      return false;
    }

    const refs = this.getRelationReferences(relation);

    refs.forEach((ref) => 
    {
      ref.value.name = newName;
    });

    relation.trigger('renamed', relation, oldName);
    relation.changed();

    this.trigger('renameRelation', this, relation, oldName);
    this.trigger('changedRelations', this);

    if (!delayChange)
    {
      this.changed();
    }

    return refs;
  }

  public renameFunction(funcInput: string | Func, newName: string, delayChange: boolean = false): false | DefinitionsFunctionReference[]
  {
    const func = this.functions.valueOf(funcInput);
    const oldName = func.name;

    if (!this.functions.rename(func, newName))
    {
      return false;
    }

    const refs = this.getFunctionReferences(func);

    refs.forEach((ref) =>
    {
      ref.value.name = newName;
    });

    func.trigger('renamed', func, oldName);
    func.changed();

    this.trigger('renameFunction', this, func, oldName);
    this.trigger('changedFunctions', this);

    if (!delayChange)
    {
      this.changed();
    }

    return refs;
  }

  public renameFunctionParameter(funcInput: string | Func, oldName: string, newName: string): false | DefinitionsFunctionReference[]
  {
    const func = this.functions.get(funcInput);

    if (!func)
    {
      return false;
    }

    if (!func.renameParameter(oldName, newName))
    {
      return false;
    }

    const refs = this.getFunctionReferences(funcInput, oldName);

    refs.forEach((ref) =>
    {
      DataTypes.objectSet(ref.value.args, newName, ref.value.args[oldName]);
      DataTypes.objectRemove(ref.value.args, oldName);
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

    if (!func.removeParameter(name))
    {
      return false;
    }

    const refs = this.getFunctionReferences(funcInput, name);

    refs.forEach((ref) =>
    {
      DataTypes.objectRemove(ref.value.args, name);
    });

    return refs;
  }

  public removeFunction(funcInput: string | Func, stopWithReferences: boolean = true, respectOrder: boolean = false, delayChange: boolean = false): boolean
  {
    const func = this.functions.valueOf(funcInput);

    if (!func)
    {
      return true;
    }

    if (stopWithReferences && this.getFunctionReferences(func).length > 0)
    {
      return false;
    }

    this.functions.remove(func, respectOrder);

    this.trigger('removeFunction', this, func);
    this.trigger('changedFunctions', this);

    if (!delayChange)
    {
      this.changed();
    }

    return true;
  }

  public clearFunctions(delayChange: boolean = false)
  {
    const functions = this.functions.values.slice();
    
    this.functions.clear();

    this.trigger('clearFunctions', this, functions);
    this.trigger('changedFunctions', this);

    if (!delayChange)
    {
      this.changed();
    }
  }

  public addMethod(entityInput: string | Entity, methodOptions: Func | Partial<FuncOptions>, sync: boolean = true, delayChange: boolean = false): boolean
  {
    const entity = this.entities.valueOf(entityInput);

    if (!entity) 
    {
      return false;
    }

    const method = methodOptions instanceof Func 
      ? methodOptions 
      : Func.create(this, methodOptions);

    const existing = entity.methods[method.name];

    if (existing)
    {
      if (sync)
      {
        existing.sync(method, this);
      }
      else
      {
        entity.addMethod(method);
      }
      
      this.trigger('updateMethod', this, method, entity);
    }
    else
    {
      entity.addMethod(method);

      this.trigger('addMethod', this, method, entity);
    }

    this.trigger('changedMethods', this);

    if (!delayChange)
    {
      this.changed();
    }

    return true;
  }

  public renameMethod(entityInput: string | Entity, methodInput: string | Func, newName: string, delayChange: boolean = false): false | DefinitionsFunctionReference[]
  {
    const entity = this.entities.valueOf(entityInput);

    if (!entity) 
    {
      return false;
    }

    const method = entity.methods[this.functions.nameOf(methodInput)];

    if (!method) 
    {
      return false;
    }

    const oldName = method.name;

    entity.renameMethod(oldName, newName);

    const refs = this.getMethodReferences(entity, method);

    refs.forEach((ref) =>
    {
      ref.value.name = newName;
    });

    method.trigger('renamed', method, oldName);
    method.changed();

    this.trigger('renameMethod', this, method, entity, oldName);
    this.trigger('changedMethods', this);

    if (!delayChange)
    {
      this.changed();
    }

    return refs;
  }

  public renameMethodParameter(entityInput: string | Entity, methodInput: string | Func, oldName: string, newName: string): false | DefinitionsFunctionReference[]
  {
    const entity = this.entities.valueOf(entityInput);

    if (!entity) 
    {
      return false;
    }

    const method = entity.methods[this.functions.nameOf(methodInput)];

    if (!method) 
    {
      return false;
    }

    if (!method.renameParameter(oldName, newName))
    {
      return false;
    }

    const refs = this.getMethodReferences(entityInput, methodInput, oldName);

    refs.forEach((ref) =>
    {
      DataTypes.objectSet(ref.value.args, newName, ref.value.args[oldName]);
      DataTypes.objectRemove(ref.value.args, oldName);
    });

    return refs;
  }

  public removeMethodParameter(entityInput: string | Entity, methodInput: string | Func, name: string): false | DefinitionsFunctionReference[]
  {
    const entity = this.entities.valueOf(entityInput);

    if (!entity) 
    {
      return false;
    }

    const method = entity.methods[this.functions.nameOf(methodInput)];

    if (!method) 
    {
      return false;
    }

    if (!method.removeParameter(name))
    {
      return false;
    }

    const refs = this.getMethodReferences(entityInput, methodInput, name);

    refs.forEach((ref) =>
    {
      DataTypes.objectRemove(ref.value.args, name);
    });

    return refs;
  }

  public removeMethod(entityInput: string | Entity, methodInput: string | Func, stopWithReferences: boolean = true, respectOrder: boolean = false, delayChange: boolean = false): boolean
  {
    const entity = this.entities.valueOf(entityInput);

    if (!entity) 
    {
      return false;
    }

    const method = entity.methods[this.functions.nameOf(methodInput)];

    if (!method) 
    {
      return false;
    }

    if (stopWithReferences && this.getMethodReferences(entityInput, methodInput).length > 0)
    {
      return false;
    }

    entity.removeMethod(method.name);


    this.trigger('removeMethod', this, method, entity);
    this.trigger('changedMethods', this);

    if (!delayChange)
    {
      this.changed();
    }

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
    if (path.length === 0)
    {
      return null;
    }

    let thisType = path[0].getType(this, context);

    if (!thisType)
    {
      return null;
    }

    let optional = thisType.isOptional();

    for (let i = 1; i < stopBefore; i++)
    {
      const node = path[i];

      thisType = node.isPathNode()
        ? node.getType(this, context, thisType)
        : thisType.getSubType(node, this, context);

      if (!thisType)
      {
        return null;
      }

      optional = optional || thisType.isOptional();
    }

    return optional && !thisType.isOptional() ? Types.optional(thisType) : thisType;
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

  public isExpression(value: any): value is (Expression | [string, ...any[]])
  {
    return value instanceof Expression || (isArray(value) && isString(value[0]) && value[0] in this.expressions);
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

  public getMethodReferences(entity?: string | Entity, func?: string | Func, param?: string): DefinitionsFunctionReference[]
  {
    const entityName = entity ? this.entities.nameOf(entity) : undefined;
    const methodName = func ? this.functions.nameOf(func) : undefined;

    return this.getExpressionClassReferences(MethodExpression).filter((match) => {
      return (!entityName || entityName === match.value.entity) && (!methodName || methodName === match.value.name) && (!param || param in match.value.args);
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

  public sync(exported: DefinitionsImportOptions): void
  {
    if (exported.data)
    {
      this.data.syncManual(
        exported.data,
        (map, value) => this.addData(value, false, true),
        (map, value) => this.removeData(value, false, true, true),
        (map, value, newValue) => this.addData(newValue, true, true),
      );
    }

    if (exported.functions)
    {
      this.functions.syncManual(
        exported.functions,
        (map, value) => this.addFunction(value, false, true),
        (map, value) => this.removeFunction(value, false, true, true),
        (map, value, newValue) => this.addFunction(newValue, true, true),
      );
    }

    if (exported.entities)
    {
      this.entities.syncManual(
        exported.entities,
        (map, value) => this.addEntity(value, false, true),
        (map, value) => this.removeEntity(value, false, true, true),
        (map, value, newValue) => this.addEntity(newValue, true, true),
      );
    }

    if (exported.relations)
    {
      this.relations.syncManual(
        exported.relations,
        (map, value) => this.addRelation(value, false, true),
        (map, value) => this.removeRelation(value, false, true, true),
        (map, value, newValue) => this.addRelation(newValue, true, true),
      );
    }

    if (exported.programs)
    {
      this.programs.syncManual(
        exported.programs,
        (map, value) => this.addProgram(value, false, true),
        (map, value) => this.removeProgram(value, true, true),
        (map, value, newValue) => this.addProgram(newValue, true, true),
      );
    }
  }

  public import(exported: DefinitionsImportOptions): void
  {
    if (exported.data)
    {
      objectEach(exported.data, (data) => 
        this.addData(data)
      );
    }

    if (exported.functions)
    {
      objectEach(exported.functions, (func) => 
        this.addFunction(func)
      );
    }

    if (exported.entities) 
    {
      objectEach(exported.entities, (instance) => 
        this.addEntity(instance)
      );
    }

    if (exported.relations)
    {
      objectEach(exported.relations, (options) => 
        this.addRelation(options)
      );
    }

    if (exported.programs)
    {
      objectEach(exported.programs, (options) => 
        this.addProgram(options)
      );
    }
  }

}