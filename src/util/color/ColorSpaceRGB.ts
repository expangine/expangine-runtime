
import { ColorSpace } from './ColorSpace';
import { Color, COMPONENT_MAX, clampComponent, isColor } from './Color';
import { isString, pad } from '../../fns';


// tslint:disable: no-magic-numbers

export const ColorSpaceRGB = new ColorSpace<Color>('rgb', 'RGB')
  .setToColor((color) => color)
  .setFromColor((color) => color)
  .addFormat({
    code: 'default',
    name: 'Default',
    parser: (data) => {
      if (!isColor(data)) {
        return null;
      }

      return data;
    },
    formatter: (color) => {
      return color;
    },
  })
  .addFormat({
    code: 'bestfit',
    name: 'Best Fit',
    parser: (data) => {
      return null;
    },
    formatter: (color) => {
      if (color.a === COMPONENT_MAX) {
        const r = formatHex(color.r);
        const g = formatHex(color.g);
        const b = formatHex(color.b);

        return '#' + r + g + b;
      } else {
        const r = clampComponent(color.r);
        const g = clampComponent(color.g);
        const b = clampComponent(color.b);
        const a = clampComponent(color.a) / COMPONENT_MAX;

        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
      }
    },
  })
  .addFormat({
    code: 'hexShort',
    name: 'Hex (#rgb)',
    parser: (data) => {
      if (!isString(data)) {
        return null;
      }
    
      const matches = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(data);
      if (!matches) {
        return null;
      }
    
      const [, r, g, b] = matches;
    
      return {
        r: parseInt(r + r, 16),
        g: parseInt(g + g, 16),
        b: parseInt(b + b, 16),
        a: COMPONENT_MAX,
      };
    },
    formatter: (color) => {
      const r = formatHex(color.r).substring(0, 1);
      const g = formatHex(color.g).substring(0, 1);
      const b = formatHex(color.b).substring(0, 1);

      return '#' + r + g + b;
    },
  })
  .addFormat({
    code: 'hex',
    name: 'Hex (#rrggbb)',
    parser: (data) => {
      if (!isString(data)) {
        return null;
      }
    
      const matches = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(data);
      if (!matches) {
        return null;
      }
    
      const [, r, g, b] = matches;
    
      return {
        r: parseInt(r, 16),
        g: parseInt(g, 16),
        b: parseInt(b, 16),
        a: COMPONENT_MAX,
      };
    },
    formatter: (color) => {
      const r = formatHex(color.r);
      const g = formatHex(color.g);
      const b = formatHex(color.b);

      return '#' + r + g + b;
    },
  })
  .addFormat({
    code: 'hexLong',
    name: 'Hex (#rrggbbaa)',
    parser: (data) => {
      if (!isString(data)) {
        return null;
      }
    
      const matches = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(data);
      if (!matches) {
        return null;
      }
    
      const [, r, g, b, a] = matches;
    
      return {
        r: parseInt(r, 16),
        g: parseInt(g, 16),
        b: parseInt(b, 16),
        a: parseInt(a, 16),
      };
    },
    formatter: (color) => {
      const r = formatHex(color.r);
      const g = formatHex(color.g);
      const b = formatHex(color.b);
      const a = formatHex(color.a);

      return '#' + r + g + b + a;
    },
  })
  .addFormat({
    code: 'rgb',
    name: 'rgb(r, g, b)',
    parser: (data) => {
      if (!isString(data)) {
        return null;
      }
    
      const matches = /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/i.exec(data);
      if (!matches) {
        return null;
      }
    
      const [, r, g, b] = matches;

      return {
        r: parseComponent(r),
        g: parseComponent(g),
        b: parseComponent(b),
        a: COMPONENT_MAX,
      };
    },
    formatter: (color) => {
      const r = clampComponent(color.r);
      const g = clampComponent(color.g);
      const b = clampComponent(color.b);

      return 'rgb(' + r + ',' + g + ',' + b + ')';
    },
  })
  .addFormat({
    code: 'rgba',
    name: 'rgba(r, g, b, a)',
    parser: (data) => {
      if (!isString(data)) {
        return null;
      }
    
      const matches = /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*([01]?\.?[0-9]*)\s*\)$/i.exec(data);
      if (!matches) {
        return null;
      }
    
      const [, r, g, b, a] = matches;

      return {
        r: parseComponent(r),
        g: parseComponent(g),
        b: parseComponent(b),
        a: clampComponent(Math.floor(parseFloat(a) * COMPONENT_MAX)),
      };
    },
    formatter: (color) => {
      const r = clampComponent(color.r);
      const g = clampComponent(color.g);
      const b = clampComponent(color.b);
      const a = clampComponent(color.a) / COMPONENT_MAX;

      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    },
  })
;

function parseComponent(x: string): number
{
  return x.indexOf('%') === -1
    ? clampComponent(parseInt(x, 10))
    : clampComponent(parseInt(x.substring(0, x.length - 1), 10) * 2.55);
}

function formatHex(x: number)
{
  return pad(clampComponent(x).toString(16), 2, '0', true);
}