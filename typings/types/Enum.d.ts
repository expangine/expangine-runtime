import { Type, TypeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser, TraverseStep } from '../Traverser';
import { Computeds } from '../Computed';
export interface EnumOptions {
    key: Type;
    value: Type;
    constants: Map<any, any>;
}
export declare class EnumType extends Type<EnumOptions> {
    static STEP_KEY: string;
    static STEP_VALUE: string;
    static id: string;
    static operations: Operations;
    static computeds: Computeds;
    static baseType: EnumType;
    static decode(data: any[], types: TypeProvider): EnumType;
    static encode(type: EnumType): any;
    static describePriority: number;
    static describe(): Type | null;
    static registered: boolean;
    static register(): void;
    getId(): string;
    getOperations(): Record<string, import("../Operation").OperationGeneric>;
    merge(type: EnumType): void;
    getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null;
    getSubTypes(def: DefinitionProvider): TypeSub[];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    isWrapper(): boolean;
    getWrappedType(): Type;
    protected isDeepCompatible(other: Type, options?: TypeCompatibleOptions): boolean;
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
    normalize(value: any): any;
    newInstance(): EnumType;
    clone(): EnumType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
