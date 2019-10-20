export declare const COMPONENT_MIN = 0;
export declare const COMPONENT_MAX = 255;
export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}
export declare function isColor(x: any): x is Color;
export declare function clampComponent(x: number): number;
