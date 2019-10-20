import { ColorSpace } from './ColorSpace';
export declare type ColorHSL = {
    h: number;
    s: number;
    l: number;
    a: number;
};
export declare function isColorHSL(x: any): x is ColorHSL;
export declare const ColorSpaceHSL: ColorSpace<ColorHSL>;
