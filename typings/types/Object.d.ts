import { Type, TypeProvider, TypeDescribeProvider, TypeInputMap, TypeMap, TypeSub, TypeCompatibleOptions } from '../Type';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
import { Traverser, TraverseStep } from '../Traverser';
export interface ObjectOptions {
    props: TypeMap;
}
export declare class ObjectType<O extends ObjectOptions = ObjectOptions> extends Type<O> {
    static wilcardProperty: string;
    static id: string;
    static operations: import("..").Operations;
    static computeds: import("..").Computeds;
    static baseType: ObjectType<ObjectOptions>;
    static decode(data: any[], types: TypeProvider): ObjectType;
    static encode(type: ObjectType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static from(types?: TypeInputMap): ObjectType;
    static registered: boolean;
    static register(): void;
    getId(): string;
    getOperations(): Record<string, import("..").Operation<any, any, any, any, any>>;
    merge(type: Type<O>, describer: TypeDescribeProvider): void;
    getSubType(expr: Expression, def: Definitions, context: Type): Type | null;
    getSubTypes(def: Definitions): TypeSub[];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    traverse<R>(traverse: Traverser<Type, R>): R;
    getTypeFromStep(step: TraverseStep): Type | null;
    setParent(parent?: Type): void;
    removeDescribedRestrictions(): void;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    isOptional(): boolean;
    isSimple(): boolean;
    getCreateExpression(): Expression;
    getValidateExpression(): Expression;
    getCompareExpression(): Expression;
    getValueChangeExpression(newValue: Expression, from?: TraverseStep, to?: TraverseStep): Expression;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): ObjectType<O>;
    clone(): ObjectType<O>;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
    getWildcardType(): Type | null;
}
