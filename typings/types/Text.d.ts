import { Type, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Expression } from '../Expression';
import { NumberType } from './Number';
import { Definitions } from '../Definitions';
import { Traverser } from '../Traverser';
export interface TextOptions {
    min?: number;
    max?: number;
    requireUpper?: boolean;
    requireLower?: boolean;
    forceUpper?: boolean;
    forceLower?: boolean;
    matches?: RegExp;
}
export declare class TextType extends Type<TextOptions> {
    static lengthType: NumberType;
    static indexType: NumberType;
    static charType: TextType;
    static id: string;
    static operations: import("..").Operations;
    static computeds: import("..").Computeds;
    static baseType: TextType;
    static decode(data: any[]): TextType;
    static encode(type: TextType): any;
    private static decodeOptions;
    private static encodeOptions;
    static describePriority: number;
    static describe(data: any): Type | null;
    static registered: boolean;
    static register(): void;
    getId(): string;
    getOperations(): Record<string, import("..").Operation<any, any, any, any, any>>;
    merge(type: TextType, describer: TypeDescribeProvider): void;
    getSubType(expr: Expression, def: Definitions, context: Type): Type | null;
    getSubTypes(def: Definitions): TypeSub[];
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
    newInstance(): TextType;
    clone(): TextType;
    encode(): any;
    create(): string;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: string): string;
    toJson(value: string): string;
}
