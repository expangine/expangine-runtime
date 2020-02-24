import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser } from '../Traverser';
export declare type AnyTypeJsonReader = (value: any, reader: (innerValue: any) => any) => any;
export declare type AnyTypeJsonWriter = (value: any, writer: (innerValue: any) => any) => any;
export declare class AnyType extends Type {
    static id: string;
    static operations: import("..").Operations;
    static computeds: import("..").Computeds;
    static baseType: AnyType;
    static decode(data: any[], types: TypeProvider): AnyType;
    static encode(type: AnyType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static registered: boolean;
    static register(): void;
    static jsonReaders: Array<{
        priority: number;
        reader: AnyTypeJsonReader;
    }>;
    static jsonWriters: Array<{
        priority: number;
        writer: AnyTypeJsonWriter;
    }>;
    static addJsonReader(priority: number, reader: AnyTypeJsonReader): void;
    static addJsonWriter(priority: number, writer: AnyTypeJsonWriter): void;
    getId(): string;
    getOperations(): Record<string, import("..").Operation<any, any, any, any, any>>;
    merge(type: AnyType): void;
    getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null;
    getSubTypes(def: DefinitionProvider): TypeSub[];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    isCompatible(other: Type): boolean;
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
    newInstance(): AnyType;
    clone(): AnyType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any | {
        $any: string;
        value: any;
    }): any;
    toJson(value: any): any | {
        $any: string;
        value: any;
    };
}
