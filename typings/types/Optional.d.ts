import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeInput, TypeCompatibleOptions, TypeChild } from '../Type';
import { Operations } from '../Operation';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser, TraverseStep } from '../Traverser';
import { Computeds } from '../Computed';
export declare type OptionalInterface<T> = T | undefined | null;
export declare class OptionalType<T = any> extends Type<OptionalInterface<T>, Type<T>> {
    static STEP_OPTIONAL: string;
    static CHILD_OPTIONAL: string;
    static id: string;
    static operations: Operations;
    static computeds: Computeds;
    static baseType: OptionalType<any>;
    static decode(data: any[], types: TypeProvider): OptionalType;
    static encode(type: OptionalType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | undefined;
    static registered: boolean;
    static register(): void;
    static for(type: TypeInput): OptionalType;
    getOperations(): Record<string, import("../Operation").OperationGeneric>;
    getId(): string;
    merge(type: OptionalType): void;
    getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | undefined;
    getSubTypes(def: DefinitionProvider): TypeSub[];
    getChildType(name: TypeChild): Type | undefined;
    getChildTypes(): TypeChild[];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    getRequired(): Type;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    isOptional(): boolean;
    isSimple(): boolean;
    protected acceptsOtherTypes(): boolean;
    traverse<R>(traverse: Traverser<Type, R>): R;
    getTypeFromStep(step: TraverseStep): Type | undefined;
    setParent(parent?: Type): void;
    removeDescribedRestrictions(): void;
    getCreateExpression(): Expression;
    getValidateExpression(): Expression;
    getCompareExpression(): Expression;
    getValueChangeExpression(newValue: Expression, from?: TraverseStep, to?: TraverseStep): Expression;
    isValid(value: any): value is OptionalInterface<T>;
    normalize(value: any): any;
    newInstance(): OptionalType<T>;
    clone(): OptionalType<T>;
    encode(): any;
    create(): OptionalInterface<T>;
    random(rnd: (a: number, b: number, whole: boolean) => number): OptionalInterface<T>;
    fromJson(json: any): OptionalInterface<T>;
    toJson(value: OptionalInterface<T>): any;
}
