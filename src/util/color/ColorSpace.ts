
import { Color } from './Color';
import { Type } from '../../Type';



export type ColorSpaceToColor<T> = (color: T) => Color;

export type ColorSpaceFromColor<T> = (color: Color) => T;

export type ColorFormatParser<T> = (value: any) => T | null;

export type ColorFormatFormatter<T> = (color: T) => any;


export interface ColorFormat<T>
{
  code: string;
  name: string;
  parser: ColorFormatParser<T>;
  formatter: ColorFormatFormatter<T>;
}


export class ColorSpace<T>
{
  public code: string;
  public name: string;
  public type: Type;
  public toColor: ColorSpaceToColor<T>;
  public fromColor: ColorSpaceFromColor<T>;
  public formatMap: Record<string, ColorFormat<T>>;
  public formats: ColorFormat<T>[];

  public constructor(code: string, name: string)
  {
    this.code = code;
    this.name = name;
    this.formatMap = {};
    this.formats = [];
  }

  public setType(type: Type): this
  {
    this.type = type;

    return this;
  }

  public setToColor(toColor: ColorSpaceToColor<T>): this
  {
    this.toColor = toColor;

    return this;
  }

  public setFromColor(fromColor: ColorSpaceFromColor<T>): this
  {
    this.fromColor = fromColor;

    return this;
  }

  public addFormat(format: ColorFormat<T>): this
  {
    this.formatMap[format.code] = format;
    this.formats.push(format);

    return this;
  }
}