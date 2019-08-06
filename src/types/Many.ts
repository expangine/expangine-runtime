
import { Type, TypeProvider, TypeClass } from '../Type';
import { Operations, Operation } from '../Operation';
import { AnyType } from './Any';



export class ManyType extends Type<Type[]>
{

  public static id = 'many';

  public static operations = new Operations<ManyType>('many:');

  public static baseType = new ManyType([AnyType.baseType]);

  public static decode(data: any[], types: TypeProvider): ManyType 
  {
    const many = data[1].map((d: any) => types.getType(d));

    return new ManyType(many);
  }

  public static encode(type: ManyType): any 
  {
    const many = type.options.map(t => t.encode());

    return [this.id, many];
  }

  public subs?: Record<string, Type>;

  public getOperations(type: TypeClass<any, any>): Record<string, Operation> 
  {
    if (!this.operations)
    {
      this.operations = {};

      this.options.forEach(many => 
      {
        const ops = many.getOperations((many as any).constructor as TypeClass<any, any>);
        
        for (const prop in ops) 
        {
          this.operations[prop] = ops[prop];
        }
      });
    }

    return this.operations;
  }

  public getSubTypes()
  {
    if (!this.subs)
    {
      this.subs = {};

      this.options.forEach(many => 
      {
        const subs = many.getSubTypes();

        if (subs)
        {
          for (const prop in subs)
          {
            this.subs[prop] = subs[prop];
          }
        }
      });
    }

    return this.subs;
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

  public getExactType(value: any): Type 
  {
    return this.forMany<Type>(this, many => (many.isValid(value) ? many : undefined));
  }

  public isCompatible(other: Type): boolean 
  {
    return this.forMany(false, many => many.isCompatible(other) ? true : undefined);
  }

  public isValid(value: any): boolean 
  {
    return this.forMany(false, many => many.isValid(value) ? true : undefined);
  }

  public normalize(value: any): any
  {
    return this.forMany(value, many => many.isValid(value) ? many.normalize(value) : undefined);
  }

  public encode(): any 
  {
    return ManyType.encode(this);
  }

}
