
import { ColorSpace } from './ColorSpace';
import { COMPONENT_MAX, clampComponent } from './Color';
import { isString, clamp, isObject, isNumber } from '../../fns';
import { NumberType } from '../../types/Number';
import { ObjectType } from '../../types/Object';


// tslint:disable: no-magic-numbers

export type ColorHSL = { h: number; s: number; l: number, a: number };


export function isColorHSL(x: any): x is ColorHSL
{
  return isObject(x) && isNumber(x.h) && isNumber(x.s) && isNumber(x.l);
}


export const ColorSpaceHSL = new ColorSpace<ColorHSL>('hsl', 'HSL')
  .setType(ObjectType.from({
    h: new NumberType({ min: 0, max: 360, whole: true }),
    s: new NumberType({ min: 0, max: 100, whole: true }),
    l: new NumberType({ min: 0, max: 100, whole: true }),
    a: new NumberType({ min: 0, max: 255, whole: true }),
  }))
  .setToColor((color) => {
    const H = normalizeHue(color.h);
    const L = clampPercent(color.l);
    const S = clampPercent(color.s);
    const C = (1 - Math.abs(2 * L - 1)) * S;
    const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
    const m = L - C / 2;
    const r1 = H < 60 || H >= 300
      ? C
      : H >= 120 && H < 240
        ? 0
        : X;
    const g1 = H >= 240
      ? 0
      : H >= 60 && H < 180
        ? C
        : X;
    const b1 = H <= 120
      ? 0
      : H >= 180 && H < 300
        ? C
        : X;

    return {
      r: (r1 + m) * COMPONENT_MAX,
      g: (g1 + m) * COMPONENT_MAX,
      b: (b1 + m) * COMPONENT_MAX,
      a: color.a
    };
  })
  .setFromColor((color) => {
    const R = clampComponent(color.r);
    const G = clampComponent(color.g);
    const B = clampComponent(color.b);
    const r1 = R / COMPONENT_MAX;
    const g1 = G / COMPONENT_MAX;
    const b1 = B / COMPONENT_MAX;
    const Cmax = Math.max(r1, g1, b1);
    const Cmin = Math.min(r1, g1, b1);
    const delta = Cmax - Cmin;
    const L = (Cmax + Cmin) / 2;

    return {
      h: delta === 0
        ? 0
        : Cmax === r1
          ? (60 * ((g1 - b1) / delta) % 6)
          : Cmax === g1
            ? (60 * ((b1 - r1) / delta) + 2)
            : (60 * ((r1 - g1) / delta) + 4),
      s: delta === 0
        ? 0
        : delta / (1 - Math.abs(2 * L - 1)),
      l: L,
      a: color.a,
    };
  })
  .addFormat({
    code: 'default',
    name: 'Default',
    parser: (data) => {
      if (!isColorHSL(data)) {
        return null;
      }

      return data;
    },
    formatter: (color) => {
      return color;
    },
  })
  .addFormat({
    code: 'hsl',
    name: 'HSL',
    parser: (data) => {
      if (!isString(data)) {
        return null;
      }
    
      const matches = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i.exec(data);
      if (!matches) {
        return null;
      }
    
      const [, h, s, l] = matches;
    
      return {
        h: normalizeHue(parseInt(h, 10)),
        s: clampPercent(parseInt(s, 10)),
        l: clampPercent(parseInt(l, 10)),
        a: COMPONENT_MAX,
      };
    },
    formatter: (color) => {
      const h = normalizeHue(color.h);
      const s = clampPercent(color.s);
      const l = clampPercent(color.l);

      return 'hsl(' + h + ',' + s + '%,' + l + '%)';
    },
  })
  .addFormat({
    code: 'hsla',
    name: 'HSLA',
    parser: (data) => {
      if (!isString(data)) {
        return null;
      }
    
      const matches = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([01]?\.?[0-9]*)\s*\)$/i.exec(data);
      if (!matches) {
        return null;
      }
    
      const [, h, s, l, a] = matches;
    
      return {
        h: normalizeHue(parseInt(h, 10)),
        s: clampPercent(parseInt(s, 10)),
        l: clampPercent(parseInt(l, 10)),
        a: clampComponent(Math.floor(parseFloat(a) * COMPONENT_MAX)),
      };
    },
    formatter: (color) => {
      const h = normalizeHue(color.h);
      const s = clampPercent(color.s);
      const l = clampPercent(color.l);
      const a = clampComponent(color.a) / COMPONENT_MAX;

      return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
    },
  })
;

function normalizeHue(h: number): number
{
  return h < 0 
    ? 360 - Math.abs(h % 360)
    : h % 360;
}

function clampPercent(x: number)
{
  return clamp(x, 0, 100);
}