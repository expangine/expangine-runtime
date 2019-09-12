import { Type, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
export interface NullOptions {
    includeUndefined?: boolean;
}
export declare class NullType extends Type<NullOptions> {
    static id: string;
    static operations: Operations;
    static baseType: NullType;
    static decode(data: any[]): NullType;
    static encode(type: NullType): any;
    static describePriority: number;
    static describe(data: any): Type | null;
    getId(): string;
    getOperations(): Record<string, import("../Operation").Operation<any, any, any>>;
    merge(type: NullType, describer: TypeDescribeProvider): void;
    getSubTypes(): null;
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): NullType;
    clone(): NullType;
    encode(): any;
    create(): null;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: null): null;
    toJson(value: null): null;
}
