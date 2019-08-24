import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { ObjectType } from './Object';
import { Expression } from '../Expression';
export interface FunctionOptions {
    returnType: Type;
    params: ObjectType;
    expression: Expression;
}
export declare class FunctionType extends Type<FunctionOptions> {
    static id: string;
    static operations: Operations<FunctionType>;
    static baseType: FunctionType;
    static decode(data: any[], types: TypeProvider): FunctionType;
    static encode(type: FunctionType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    getId(): string;
    merge(type: FunctionType, describer: TypeDescribeProvider): void;
    getSubTypes(): {
        returnType: Type<any>;
        params: ObjectType;
    };
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(value: any): boolean;
    normalize(value: any): any;
    encode(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
