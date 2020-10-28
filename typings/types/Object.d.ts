import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions, TypeChild, TypeMapFor } from '../Type';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser, TraverseStep } from '../Traverser';
export declare type ObjectInterface = Record<string, any>;
export interface ObjectOptions<O extends ObjectInterface> {
    props: TypeMapFor<O>;
}
export declare class ObjectType<D extends ObjectInterface = ObjectInterface, O extends ObjectOptions<D> = ObjectOptions<D>> extends Type<D, O> {
    static wilcardProperty: string;
    static id: string;
    static operations: import("..").Operations;
    static computeds: import("..").Computeds;
    static baseType: ObjectType<Record<string, any>, {
        props: {};
    }>;
    static decode(data: any[], types: TypeProvider): ObjectType;
    static encode(type: ObjectType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | null;
    static registered: boolean;
    static register(): void;
    getId(): string;
    getOperations(): Record<string, import("..").OperationGeneric>;
    merge(type: Type<D>): void;
    getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null;
    getSubTypes(def: DefinitionProvider): TypeSub[];
    getChildType(name: TypeChild): Type | null;
    getChildTypes(): TypeChild[];
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
    isValid(value: any): value is D;
    normalize(value: any): any;
    newInstance(): ObjectType<D, O>;
    clone(): ObjectType<D, O>;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): D;
    toJson(value: D): any;
    getWildcardType(): Type | null;
}
