
import { toArray } from '../fns';
import { Type, TypeDescribeProvider, TypeProvider } from '../Type';
import { Operations } from '../Operation';
import { TextType } from './Text';


const INDEX_KEY = 1;
const INDEX_VALUE = 2;
const INDEX_CONSTANTS = 3;

export interface EnumOptions 
{
  key: Type;
  value: Type;
  constants: Map<any, any>;
}

export class EnumType extends Type<EnumOptions> 
{

  public static id = 'enum';

  public static operations = new Operations<EnumType>('enum:');
  
  public static baseType = new EnumType({ key: TextType.baseType, value: TextType.baseType, constants: new Map() });

  public static decode(data: any[], types: TypeProvider): EnumType 
  {
    const key = types.getType(data[INDEX_KEY]);
    const value = types.getType(data[INDEX_VALUE]);
    const constants = new Map(data[INDEX_CONSTANTS]);

    return new EnumType({ key, value, constants });
  }

  public static encode(type: EnumType): any 
  {
    const { key, value, constants } = type.options;

    return [
      this.id,
      key.encode(),
      value.encode(),
      toArray(constants.entries())
    ];
  }

  public static describePriority: number = -1;
  
  public static describe(): Type | null
  {
    return null;
  }

  public merge(type: EnumType, describer: TypeDescribeProvider): void
  {
    
  }

  public getSubTypes()
  {
    const { key, value } = this.options;

    return { key, value };
  }

  public getExactType(value: any): Type 
  {
    return this;
  }

  public isCompatible(other: Type): boolean 
  {
    return other instanceof EnumType;
  }

  public isValid(value: any): boolean 
  {
    return this.options.constants.has(value);
  }

  public normalize(value: any): any
  {
    return value;
  }

  public encode(): any 
  {
    return EnumType.encode(this);
  }

  public random(rnd: (a: number, b: number, whole: boolean) => number): any
  {
    const values = toArray(this.options.constants.values());

    return values[rnd(0, values.length, true)];
  }

}