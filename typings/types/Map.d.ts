import { Type, TypeProvider, TypeInput, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser, TraverseStep } from '../Traverser';
export interface MapOptions {
    key: Type;
    value: Type;
}
export declare class MapType extends Type<MapOptions> {
    static STEP_KEY: string;
    static STEP_VALUE: string;
    static id: string;
    static operations: import("..").Operations;
    static computeds: import("..").Computeds;
    static baseType: MapType;
    static decode(data: any[], types: TypeProvider): MapType;
    static encode(type: MapType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static registered: boolean;
    static register(): void;
    static forItem(valueOrClass: TypeInput, keyOrClass?: TypeInput): MapType;
    getId(): string;
    getOperations(): Record<string, import("..").OperationGeneric>;
    merge(type: MapType): void;
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
    isValid(test: any): boolean;
    normalize(test: any): any;
    private iterate;
    newInstance(): MapType;
    clone(): MapType;
    encode(): any;
    create(): Map<any, any>;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: Array<[any, any]>): Map<any, any>;
    toJson(map: Map<any, any>): Array<[any, any]>;
}
