import { Type, TypeProvider, TypeClass } from '../Type';
import { Operations, Operation } from '../Operation';
export declare class ManyType extends Type<Type[]> {
    static id: string;
    static operations: Operations<ManyType>;
    static baseType: ManyType;
    static decode(data: any[], types: TypeProvider): ManyType;
    static encode(type: ManyType): any;
    subs?: Record<string, Type>;
    getOperations(type: TypeClass<any, any>): Record<string, Operation>;
    getSubTypes(): Record<string, Type<any>>;
    private forMany;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
}
