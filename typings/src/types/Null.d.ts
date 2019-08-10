import { Type, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
export interface NullOptions {
    includeUndefined?: boolean;
}
export declare class NullType extends Type<NullOptions> {
    static id: string;
    static operations: Operations<NullType>;
    static baseType: NullType;
    static decode(data: any[]): NullType;
    static encode(type: NullType): any;
    static describePriority: number;
    static describe(data: any): Type | null;
    merge(type: NullType, describer: TypeDescribeProvider): void;
    getSubTypes(): null;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
}
