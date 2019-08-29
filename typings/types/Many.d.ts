import { Type, TypeProvider, TypeClass, TypeDescribeProvider } from '../Type';
import { Operations, Operation } from '../Operation';
export declare class ManyType extends Type<Type[]> {
    static id: string;
    static operations: Operations<ManyType>;
    static baseType: ManyType;
    static decode(data: any[], types: TypeProvider): ManyType;
    static encode(type: ManyType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    subs?: Record<string, Type>;
    getOperations(type: TypeClass<any, any>): Record<string, Operation>;
    private forMany;
    getId(): string;
    merge(type: ManyType, describer: TypeDescribeProvider): void;
    getSubTypes(): Record<string, Type<any>>;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
