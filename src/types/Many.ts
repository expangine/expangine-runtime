
import { Type, TypeProvider, TypeDescribeProvider, TypeMap } from '../Type';
import { Operations, Operation } from '../Operation';
import { AnyType } from './Any';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { AnyOps } from '../ops/AnyOps';
import { Definitions } from '../Definitions';
import { ID } from './ID';
import { isEmpty } from '../fns';
import { Traverser } from '../Traverser';


const INDEX_MANY = 1;

export class ManyType extends Type<Type[]>
{

  public static id = ID.Many;

  public static operations = new Operations(ID.Many + ':');

  public static baseType = new ManyType([AnyType.baseType]);

  public static decode(data: any[], types: TypeProvider): ManyType 
  {
    const many = data[INDEX_MANY].map((d: any) => types.getType(d));

    return new ManyType(many);
  }

  public static encode(type: ManyType): any 
  {
    const many = type.options.map(t => t.encode());

    return [this.id, many];
  }

  public static describePriority: number = -1;
  
  public static describe(data: any, describer: TypeDescribeProvider): Type | null
  {
    return null;
  }

  public operations?: Record<string, Operation<any, any, any, any, any>>;

  public getOperations()
  {
    if (!this.operations)
    {
      this.operations = {};

      this.options.forEach(many => 
      {
        const ops = many.getOperations();
        
        for (const prop in ops) 
        {
          this.operations[prop] = ops[prop];
        }
      });
    }

    return this.operations;
  }

  private forMany<T> (otherwise: T, handler: (type: Type) => T | undefined): T
  {
    const many = this.options;

    for (const type of many)
    {
      const result = handler(type);

      if (result !== undefined)
      {
        return result;
      } 
    }

    return otherwise;
  }

  public getId(): string
  {
    return ManyType.id;
  }

  public merge(type: ManyType, describer: TypeDescribeProvider): void
  {
    
  }

  public getSubType(expr: Expression, def: Definitions, context: Type): Type | null
  {
    for (const sub of this.options)
    {
      const subType = sub.getSubType(expr, def, context);

      if (subType)
      {
        return subType;
      }
    }

    return null;
  }

  public getSubTypes(): [TypeMap, Type[]] | null
  {
    const named: TypeMap = {};
    let types: Type[] = [];
    const many = this.options;

    for (let i = many.length - 1; i >= 0; i--)
    {
      const sub = many[i].getSubTypes();

      if (sub)
      {
        Object.assign(named, sub[0]);
        types = types.concat(sub[1]);
      }
    }

    return isEmpty(named) && types.length === 0
      ? null
      : [named, types];
  }

  public getExactType(value: any): Type 
  {
    return this.forMany<Type>(this, many => (many.isValid(value) ? many : undefined));
  }

  public getSimplifiedType(): Type
  {
    return this.options.length === 1
      ? this.options[0]
      : this;
  }

  public isCompatible(other: Type): boolean 
  {
    return this.forMany(false, many => many.isCompatible(other) ? true : undefined);
  }

  public traverse<R>(traverse: Traverser<Type, R>): R
  {
    return traverse.enter(this, () =>
      this.options.map((type, index) => traverse.step(index, type))
    );
  }

  public setParent(parent?: Type): void
  {
    this.parent = parent;

    this.options.forEach(t => t.setParent(this));
  }

  public getCreateExpression(ex: ExpressionBuilder): Expression
  {
    return this.options[0].getCreateExpression(ex);
  }

  public getValidateExpression(ex: ExpressionBuilder): Expression
  {
    return ex.or(
      ...this.options.map((t) => t.getValidateExpression(ex))
    );
  }

  public getCompareExpression(ex: ExpressionBuilder): Expression
  {
    return ex.op(AnyOps.cmp, {
      value: ex.get('value'), 
      test: ex.get('test'),
    });
  }

  public isValid(value: any): boolean 
  {
    return this.forMany(false, many => many.isValid(value) ? true : undefined);
  }

  public normalize(value: any): any
  {
    return this.forMany(value, many => many.isValid(value) ? many.normalize(value) : undefined);
  }

  public newInstance(): ManyType
  {
    return new ManyType([]);
  }

  public clone(): ManyType
  {
    return new ManyType(this.options.map(e => e.clone()));
  }

  public encode(): any 
  {
    return ManyType.encode(this);
  }

  public create(): any
  {
    return this.options.length > 0
      ? this.options[0].create()
      : null;
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const options = this.options;
    const chosen = rnd(0, options.length, true);

    return options[chosen].random(rnd);
  }

  public fromJson(json: any): any
  {
    const options = this.options;

    for (const many of options)
    {
      const parsed = many.normalize(json);

      if (parsed !== null && parsed !== undefined)
      {
        return parsed;
      }
    }

    return json;
  }

  public toJson(value: any): any
  {
    const options = this.options;

    for (const many of options)
    {
      if (many.isValid(value))
      {
        return many.toJson(value);
      }
    }

    return value;
  }

}
