import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { ObjectType, ObjectOptions } from './Object';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
import { Traverser } from '../Traverser';
import { Computeds } from '../Computed';
export interface FunctionOptions {
    returnType: Type;
    params: ObjectType<ObjectOptions>;
    expression: Expression;
}
export declare class FunctionType extends Type<FunctionOptions> {
    static id: string;
    static operations: Operations;
    static computeds: Computeds;
    static baseType: FunctionType;
    static decode(data: any[], types: TypeProvider): FunctionType;
    static encode(type: FunctionType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static registered: boolean;
    static register(): void;
    getId(): string;
    getOperations(): Record<string, import("../Operation").Operation<any, any, any, any, any>>;
    merge(type: FunctionType, describer: TypeDescribeProvider): void;
    getSubType(expr: Expression, def: Definitions, context: Type): Type | null;
    getSubTypes(def: Definitions): TypeSub[];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    isOptional(): boolean;
    isSimple(): boolean;
    traverse<R>(traverse: Traverser<Type, R>): R;
    setParent(parent?: Type): void;
    removeDescribedRestrictions(): void;
    getCreateExpression(): Expression;
    getValidateExpression(): Expression;
    getCompareExpression(): Expression;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): FunctionType;
    clone(): FunctionType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
