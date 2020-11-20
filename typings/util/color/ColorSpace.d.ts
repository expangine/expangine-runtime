import { Color } from './Color';
import { Type } from '../../Type';
export declare type ColorSpaceToColor<T> = (color: T) => Color;
export declare type ColorSpaceFromColor<T> = (color: Color) => T;
export declare type ColorFormatParser<T> = (value: any) => T | null;
export declare type ColorFormatFormatter<T> = (color: T) => any;
export interface ColorFormat<T> {
    code: string;
    name: string;
    parser: ColorFormatParser<T>;
    formatter: ColorFormatFormatter<T>;
}
export declare class ColorSpace<T> {
    code: string;
    name: string;
    type?: Type;
    toColor?: ColorSpaceToColor<T>;
    fromColor?: ColorSpaceFromColor<T>;
    formatMap: Record<string, ColorFormat<T>>;
    formats: ColorFormat<T>[];
    constructor(code: string, name: string);
    setType(type: Type): this;
    setToColor(toColor: ColorSpaceToColor<T>): this;
    setFromColor(fromColor: ColorSpaceFromColor<T>): this;
    addFormat(format: ColorFormat<T>): this;
}
