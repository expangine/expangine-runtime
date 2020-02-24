import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser, TraverseStep } from '../Traverser';
import { Computeds } from '../Computed';
export declare class NotType extends Type<Type[]> {
    static id: string;
    static operations: Operations;
    static computeds: Computeds;
    static baseType: NotType;
    static decode(data: any[], types: TypeProvider): NotType;
    static encode(type: NotType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static registered: boolean;
    static register(): void;
    getOperations(): {};
    private forNot;
    getId(): string;
    merge(type: NotType): void;
    getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null;
    getSubTypes(def: DefinitionProvider): TypeSub[];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    protected acceptsOtherTypes(): boolean;
    isOptional(): boolean;
    isSimple(): boolean;
    traverse<R>(traverse: Traverser<Type, R>): R;
    getTypeFromStep(step: TraverseStep): Type | null;
    setParent(parent?: Type): void;
    removeDescribedRestrictions(): void;
    getCreateExpression(): Expression;
    getValidateExpression(): Expression;
    getCompareExpression(): Expression;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): NotType;
    clone(): NotType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
