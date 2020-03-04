import { Type, TypeProvider, TypeInput, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser, TraverseStep } from '../Traverser';
export interface ListOptions {
    item: Type;
    min?: number;
    max?: number;
}
export declare class ListType extends Type<ListOptions> {
    static STEP_ITEM: string;
    static id: string;
    static operations: import("..").Operations;
    static computeds: import("..").Computeds;
    static baseType: ListType;
    static decode(data: any[], types: TypeProvider): ListType;
    static encode(type: ListType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static registered: boolean;
    static register(): void;
    static forItem(itemOrClass: TypeInput): ListType;
    getId(): string;
    getOperations(): Record<string, import("..").OperationGeneric>;
    merge(type: ListType): void;
    getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null;
    getSubTypes(def: DefinitionProvider): TypeSub[];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    isOptional(): boolean;
    isSimple(): boolean;
    traverse<R>(traverse: Traverser<Type, R>): R;
    getTypeFromStep(step: TraverseStep): Type | null;
    setParent(parent?: Type): void;
    removeDescribedRestrictions(): void;
    getCreateExpression(): Expression;
    getValidateExpression(): Expression;
    getCompareExpression(): Expression;
    getValueChangeExpression(newValue: Expression, from?: TraverseStep, to?: TraverseStep): Expression;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): ListType;
    clone(): ListType;
    encode(): any;
    create(): any[];
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any[]): any[];
    toJson(value: any[]): any[];
}
