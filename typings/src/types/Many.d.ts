import { Type, TypeProvider } from '../Type';
import { Operations } from '../Operation';
export declare class ManyType extends Type<Type[]> {
    static id: string;
    static operations: Operations<ManyType>;
    static baseType: ManyType;
    static decode(data: any[], types: TypeProvider): ManyType;
    static encode(type: ManyType): any;
    getSubTypes(): null;
    private forMany;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
}
