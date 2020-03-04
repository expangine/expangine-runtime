import { Type, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser } from '../Traverser';
import { Computeds } from '../Computed';
export declare class NullType extends Type<null> {
    static id: string;
    static operations: Operations;
    static computeds: Computeds;
    static baseType: NullType;
    static decode(data: any[]): NullType;
    static encode(type: NullType): any;
    static describePriority: number;
    static describe(data: any): Type | null;
    static registered: boolean;
    static register(): void;
    getId(): string;
    getOperations(): Record<string, import("../Operation").OperationGeneric>;
    merge(type: NullType): void;
    getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null;
    getSubTypes(def: DefinitionProvider): TypeSub[];
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
    newInstance(): NullType;
    clone(): NullType;
    encode(): any;
    create(): null;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: null): null;
    toJson(value: null): null;
}
