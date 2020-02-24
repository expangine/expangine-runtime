import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations, OperationGeneric } from '../Operation';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser, TraverseStep } from '../Traverser';
import { Computeds } from '../Computed';
export declare class ManyType extends Type<Type[]> {
    static id: string;
    static operations: Operations;
    static computeds: Computeds;
    static baseType: ManyType;
    static decode(data: any[], types: TypeProvider): ManyType;
    static encode(type: ManyType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static registered: boolean;
    static register(): void;
    operations?: Record<string, OperationGeneric>;
    getOperations(): Record<string, import("../Operation").Operation<any, any, any, any, any>>;
    private forMany;
    getId(): string;
    merge(type: ManyType): void;
    getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null;
    getSubTypes(def: DefinitionProvider): TypeSub[];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    getRequired(): Type;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    isOptional(): boolean;
    isSimple(): boolean;
    protected acceptsOtherTypes(): boolean;
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
    newInstance(): ManyType;
    clone(): ManyType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
