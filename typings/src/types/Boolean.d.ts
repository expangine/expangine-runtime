import { Type, TypeProvider } from '../Type';
import { Operations } from '../Operation';
export interface BooleanOptions {
    true?: Record<string, true>;
    false?: Record<string, false>;
}
export declare class BooleanType extends Type<BooleanOptions> {
    static id: string;
    static operations: Operations<BooleanType>;
    static baseType: BooleanType;
    static decode(data: any[], types: TypeProvider): BooleanType;
    static encode(type: BooleanType): any;
    getSubTypes(): null;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
}
