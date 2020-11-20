import { Type, TypeCompatibleOptions, TypeDescribeProvider } from '../Type';
import { Expression } from '../Expression';
import { NumberType } from './Number';
import { Color } from '../util/color/Color';
import { ColorSpace, ColorFormat } from '../util/color/ColorSpace';
import { ObjectType, ObjectOptions } from './Object';
export interface ColorOptions extends ObjectOptions<Color> {
    hasAlpha?: boolean;
}
export declare class ColorType extends ObjectType<Color, ColorOptions> {
    static readonly componentType: NumberType;
    static readonly componentProps: {
        r: NumberType;
        g: NumberType;
        b: NumberType;
        a: NumberType;
    };
    static spaces: ColorSpace<any>[];
    static id: string;
    static operations: import("..").Operations;
    static computeds: import("..").Computeds;
    static baseType: ColorType;
    static decode(data: any[]): ColorType;
    static encode(type: ColorType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): ColorType | undefined;
    static registered: boolean;
    static register(): void;
    static getFormat(id: string): ColorFormat<any> | undefined;
    constructor(colorOptions?: {
        hasAlpha?: boolean;
    });
    getId(): string;
    getOperations(): Record<string, import("..").OperationGeneric>;
    merge(type: ColorType): void;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    isOptional(): boolean;
    isSimple(): boolean;
    removeDescribedRestrictions(): void;
    getCreateExpression(): Expression;
    getValidateExpression(): Expression;
    getCompareExpression(): Expression;
    isValid(value: any): value is Color;
    normalize(value: any): any;
    newInstance(): ColorType;
    clone(): ColorType;
    encode(): any;
    create(): Color;
    random(rnd: (a: number, b: number, whole: boolean) => number): Color;
    fromJson(json: Color): Color;
    toJson(value: Color): Color;
}
