import { Type, TypeDescribeProvider, TypeCompatibleOptions } from '../Type';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { NumberType } from './Number';
import { Color } from '../util/color/Color';
import { ColorSpace, ColorFormat } from '../util/color/ColorSpace';
import { ObjectType, ObjectOptions } from './Object';
export interface ColorOptions extends ObjectOptions {
    hasAlpha?: boolean;
}
export declare class ColorType extends ObjectType<ColorOptions> {
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
    static baseType: ColorType;
    static decode(data: any[]): ColorType;
    static encode(type: ColorType): any;
    static describePriority: number;
    static describe(data: any): Type | null;
    static registered: boolean;
    static register(): void;
    static getFormat(id: string): ColorFormat<any> | undefined;
    constructor(colorOptions?: {
        hasAlpha?: boolean;
    });
    getId(): string;
    getOperations(): Record<string, import("..").Operation<any, any, any, any, any>>;
    merge(type: ColorType, describer: TypeDescribeProvider): void;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    removeDescribedRestrictions(): void;
    getCreateExpression(ex: ExpressionBuilder): Expression;
    getValidateExpression(ex: ExpressionBuilder): Expression;
    getCompareExpression(ex: ExpressionBuilder): Expression;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): ColorType;
    clone(): ColorType;
    encode(): any;
    create(): Color;
    random(rnd: (a: number, b: number, whole: boolean) => number): Color;
    fromJson(json: Color): Color;
    toJson(value: Color): Color;
}
