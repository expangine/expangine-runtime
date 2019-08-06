
import { Type, TypeProvider } from '../Type';
import { Operations } from '../Operation';
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

  public getSubTypes(): null
  {
    return null;
  }

  private forMany<T> (otherwise: T, handler: (type: Type) => T | undefined): T
  {
    const many = this.options;

    for (let i = 0; i < many.length; i++) 
    {
      const result = handler(many[i]);

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
