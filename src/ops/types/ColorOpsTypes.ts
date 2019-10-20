
import { ColorType } from '../../types/Color';
import { NumberType } from '../../types/Number';
import { BooleanType } from '../../types/Boolean';
import { TextType } from '../../types/Text';
import { AnyType } from '../../types/Any';

import { ColorOps } from '../ColorOps';
import { DateType } from '../../types/Date';
import { ListType } from '../../types/List';
import { MapType } from '../../types/Map';
import { TupleType } from '../../types/Tuple';
import { EnumType } from '../../types/Enum';
import { ManyType } from '../../types/Many';
import { OptionalType } from '../../types/Optional';
import { ColorSpaceHSL } from '../../util/color/ColorSpaceHSL';
import { Color } from '../../util/color/Color';


const ops = ColorType.operations;

export const ColorComponentEnum = new EnumType({
  key: TextType.baseType,
  value: TextType.baseType,
  constants: new Map([
    ['r', 'r'],
    ['g', 'g'],
    ['b', 'b'],
    ['a', 'a'],
  ]),
});

export const ColorOrNumber = new ManyType([
  ColorType.baseType,
  new NumberType({ }),
]);

export const ColorFormats = new EnumType({
  key: TextType.baseType,
  value: TextType.baseType,
  constants: new Map([
    ['Best Fit: #rrggbb or rgb()', 'rgb:bestfit'],
    ['#rgb', 'rgb:hexShort'],
    ['#rrggbb', 'rgb:hex'],
    ['#rrggbbaa', 'rgb:hexLong'],
    ['rgb(r, g, b)', 'rgb:rgb'],
    ['rgba(r, g, b, a)', 'rgb:rgba'],
    ['hsl(h, s, l)', 'hsl:hsl'],
    ['hsla(h, s, l, a)', 'hsl:hsla'],
  ]),
});

export const ColorNames = new EnumType({
  key: TextType.baseType,
  value: ColorType.baseType,
  constants: new Map<string, Color>([
    ['Transparent', { r: 255, g: 255, b: 255, a: 0 }],
    ['Alice Blue', { r: 240, g: 248, b: 255, a: 255 }],
    ['Antique White', { r: 250, g: 235, b: 215, a: 255 }],
    ['Aqua', { r: 0, g: 255, b: 255, a: 255 }],
    ['Aquamarine', { r: 127, g: 255, b: 212, a: 255 }],
    ['Azure', { r: 240, g: 255, b: 255, a: 255 }],
    ['Beige', { r: 245, g: 245, b: 220, a: 255 }],
    ['Bisque', { r: 255, g: 228, b: 196, a: 255 }],
    ['Black', { r: 0, g: 0, b: 0, a: 255 }],
    ['Blanched Almond', { r: 255, g: 235, b: 205, a: 255 }],
    ['Blue', { r: 0, g: 0, b: 255, a: 255 }],
    ['Blue Violet', { r: 138, g: 43, b: 226, a: 255 }],
    ['Brown', { r: 165, g: 42, b: 42, a: 255 }],
    ['Burly Wood', { r: 222, g: 184, b: 135, a: 255 }],
    ['Cadet Blue', { r: 95, g: 158, b: 160, a: 255 }],
    ['Chartreuse', { r: 127, g: 255, b: 0, a: 255 }],
    ['Chocolate', { r: 210, g: 105, b: 30, a: 255 }],
    ['Coral', { r: 255, g: 127, b: 80, a: 255 }],
    ['Cornflower Blue', { r: 100, g: 149, b: 237, a: 255 }],
    ['Cornsilk', { r: 255, g: 248, b: 220, a: 255 }],
    ['Crimson', { r: 220, g: 20, b: 60, a: 255 }],
    ['Cyan', { r: 0, g: 255, b: 255, a: 255 }],
    ['Dark Blue', { r: 0, g: 0, b: 139, a: 255 }],
    ['Dark Cyan', { r: 0, g: 139, b: 139, a: 255 }],
    ['Dark Goldenrod', { r: 184, g: 134, b: 11, a: 255 }],
    ['Dark Gray', { r: 169, g: 169, b: 169, a: 255 }],
    ['Dark Green', { r: 0, g: 100, b: 0, a: 255 }],
    ['Dark Khaki', { r: 189, g: 183, b: 107, a: 255 }],
    ['Dark Magenta', { r: 139, g: 0, b: 139, a: 255 }],
    ['Dark Olive Green', { r: 85, g: 107, b: 47, a: 255 }],
    ['Dark Orange', { r: 255, g: 140, b: 0, a: 255 }],
    ['Dark Orchid', { r: 153, g: 50, b: 204, a: 255 }],
    ['Dark Red', { r: 139, g: 0, b: 0, a: 255 }],
    ['Dark Salmon', { r: 233, g: 150, b: 122, a: 255 }],
    ['Dark Sea Green', { r: 143, g: 188, b: 139, a: 255 }],
    ['Dark Slate Blue', { r: 72, g: 61, b: 139, a: 255 }],
    ['Dark Slate Gray', { r: 47, g: 79, b: 79, a: 255 }],
    ['Dark Turquoise', { r: 0, g: 206, b: 209, a: 255 }],
    ['Dark Violet', { r: 148, g: 0, b: 211, a: 255 }],
    ['Deep Pink', { r: 255, g: 20, b: 147, a: 255 }],
    ['Deep Sky Blue', { r: 0, g: 191, b: 255, a: 255 }],
    ['Dim Gray', { r: 105, g: 105, b: 105, a: 255 }],
    ['Dodger Blue', { r: 30, g: 144, b: 255, a: 255 }],
    ['Firebrick', { r: 178, g: 34, b: 34, a: 255 }],
    ['Floral White', { r: 255, g: 250, b: 240, a: 255 }],
    ['Forest Green', { r: 34, g: 139, b: 34, a: 255 }],
    ['Fuchsia', { r: 255, g: 0, b: 255, a: 255 }],
    ['Gainsboro', { r: 220, g: 220, b: 220, a: 255 }],
    ['Ghost White', { r: 248, g: 248, b: 255, a: 255 }],
    ['Gold', { r: 255, g: 215, b: 0, a: 255 }],
    ['Goldenrod', { r: 218, g: 165, b: 32, a: 255 }],
    ['Gray', { r: 128, g: 128, b: 128, a: 255 }],
    ['Green', { r: 0, g: 128, b: 0, a: 255 }],
    ['Green Yellow', { r: 173, g: 255, b: 47, a: 255 }],
    ['Honeydew', { r: 240, g: 255, b: 240, a: 255 }],
    ['Hot Pink', { r: 255, g: 105, b: 180, a: 255 }],
    ['Indian Red', { r: 205, g: 92, b: 92, a: 255 }],
    ['Indigo', { r: 75, g: 0, b: 130, a: 255 }],
    ['Ivory', { r: 255, g: 255, b: 240, a: 255 }],
    ['Khaki', { r: 240, g: 230, b: 140, a: 255 }],
    ['Lavender', { r: 230, g: 230, b: 250, a: 255 }],
    ['Lavender Blush', { r: 255, g: 240, b: 245, a: 255 }],
    ['Lawn Green', { r: 124, g: 252, b: 0, a: 255 }],
    ['Lemon Chiffon', { r: 255, g: 250, b: 205, a: 255 }],
    ['Light Blue', { r: 173, g: 216, b: 230, a: 255 }],
    ['Light Coral', { r: 240, g: 128, b: 128, a: 255 }],
    ['Light Cyan', { r: 224, g: 255, b: 255, a: 255 }],
    ['Light Goldenrod Yellow', { r: 250, g: 250, b: 210, a: 255 }],
    ['Light Gray', { r: 211, g: 211, b: 211, a: 255 }],
    ['Light Green', { r: 144, g: 238, b: 144, a: 255 }],
    ['Light Pink', { r: 255, g: 182, b: 193, a: 255 }],
    ['Light Salmon', { r: 255, g: 160, b: 122, a: 255 }],
    ['Light Sea Green', { r: 32, g: 178, b: 170, a: 255 }],
    ['Light Sky Blue', { r: 135, g: 206, b: 250, a: 255 }],
    ['Light Slate Gray', { r: 119, g: 136, b: 153, a: 255 }],
    ['Light Steel Blue', { r: 176, g: 196, b: 222, a: 255 }],
    ['Light Yellow', { r: 255, g: 255, b: 224, a: 255 }],
    ['Lime', { r: 0, g: 255, b: 0, a: 255 }],
    ['LimeGreen', { r: 50, g: 205, b: 50, a: 255 }],
    ['Linen', { r: 250, g: 240, b: 230, a: 255 }],
    ['Magenta', { r: 255, g: 0, b: 255, a: 255 }],
    ['Maroon', { r: 128, g: 0, b: 0, a: 255 }],
    ['Medium Aquamarine', { r: 102, g: 205, b: 170, a: 255 }],
    ['Medium Blue', { r: 0, g: 0, b: 205, a: 255 }],
    ['Medium Orchid', { r: 186, g: 85, b: 211, a: 255 }],
    ['Medium Purple', { r: 147, g: 112, b: 219, a: 255 }],
    ['Medium Sea Green', { r: 60, g: 179, b: 113, a: 255 }],
    ['Medium Slate Blue', { r: 123, g: 104, b: 238, a: 255 }],
    ['Medium Spring Green', { r: 0, g: 250, b: 154, a: 255 }],
    ['Medium Turquoise', { r: 72, g: 209, b: 204, a: 255 }],
    ['Medium VioletRed', { r: 199, g: 21, b: 133, a: 255 }],
    ['Midnight Blue', { r: 25, g: 25, b: 112, a: 255 }],
    ['Mint Cream', { r: 245, g: 255, b: 250, a: 255 }],
    ['Misty Rose', { r: 255, g: 228, b: 225, a: 255 }],
    ['Moccasin', { r: 255, g: 228, b: 181, a: 255 }],
    ['Navajo White', { r: 255, g: 222, b: 173, a: 255 }],
    ['Navy', { r: 0, g: 0, b: 128, a: 255 }],
    ['Old Lace', { r: 253, g: 245, b: 230, a: 255 }],
    ['Olive', { r: 128, g: 128, b: 0, a: 255 }],
    ['Olive Drab', { r: 107, g: 142, b: 35, a: 255 }],
    ['Orange', { r: 255, g: 165, b: 0, a: 255 }],
    ['Orange Red', { r: 255, g: 69, b: 0, a: 255 }],
    ['Orchid', { r: 218, g: 112, b: 214, a: 255 }],
    ['Pale Goldenrod', { r: 238, g: 232, b: 170, a: 255 }],
    ['Pale Green', { r: 152, g: 251, b: 152, a: 255 }],
    ['Pale Turquoise', { r: 175, g: 238, b: 238, a: 255 }],
    ['Pale Violet Red', { r: 219, g: 112, b: 147, a: 255 }],
    ['Papaya Whip', { r: 255, g: 239, b: 213, a: 255 }],
    ['Peach Puff', { r: 255, g: 218, b: 185, a: 255 }],
    ['Peru', { r: 205, g: 133, b: 63, a: 255 }],
    ['Pink', { r: 255, g: 192, b: 203, a: 255 }],
    ['Plum', { r: 221, g: 160, b: 221, a: 255 }],
    ['Powder Blue', { r: 176, g: 224, b: 230, a: 255 }],
    ['Purple', { r: 128, g: 0, b: 128, a: 255 }],
    ['Red', { r: 255, g: 0, b: 0, a: 255 }],
    ['Rosy Brown', { r: 188, g: 143, b: 143, a: 255 }],
    ['Royal Blue', { r: 65, g: 105, b: 225, a: 255 }],
    ['Saddle Brown', { r: 139, g: 69, b: 19, a: 255 }],
    ['Salmon', { r: 250, g: 128, b: 114, a: 255 }],
    ['Sandy Brown', { r: 244, g: 164, b: 96, a: 255 }],
    ['Sea Green', { r: 46, g: 139, b: 87, a: 255 }],
    ['Sea Shell', { r: 255, g: 245, b: 238, a: 255 }],
    ['Sienna', { r: 160, g: 82, b: 45, a: 255 }],
    ['Silver', { r: 192, g: 192, b: 192, a: 255 }],
    ['Sky Blue', { r: 135, g: 206, b: 235, a: 255 }],
    ['Slate Blue', { r: 106, g: 90, b: 205, a: 255 }],
    ['Slate Gray', { r: 112, g: 128, b: 144, a: 255 }],
    ['Snow', { r: 255, g: 250, b: 250, a: 255 }],
    ['Spring Green', { r: 0, g: 255, b: 127, a: 255 }],
    ['Steel Blue', { r: 70, g: 130, b: 180, a: 255 }],
    ['Tan', { r: 210, g: 180, b: 140, a: 255 }],
    ['Teal', { r: 0, g: 128, b: 128, a: 255 }],
    ['Thistle', { r: 216, g: 191, b: 216, a: 255 }],
    ['Tomato', { r: 255, g: 99, b: 71, a: 255 }],
    ['Turquoise', { r: 64, g: 224, b: 208, a: 255 }],
    ['Violet', { r: 238, g: 130, b: 238, a: 255 }],
    ['Wheat', { r: 245, g: 222, b: 179, a: 255 }],
    ['White', { r: 255, g: 255, b: 255, a: 255 }],
    ['White Smoke', { r: 245, g: 245, b: 245, a: 255 }],
    ['Yellow', { r: 255, g: 255, b: 0, a: 255 }],
    ['Yellow Green', { r: 154, g: 205, b: 50, a: 255 }],
  ]),
});

// a = bottom layer (0 -> 1)
// b = top layer (0 -> 1)

export const ColorBlendModes = new EnumType({
  key: TextType.baseType,
  value: TextType.baseType,
  constants: new Map([
    ['Multiply', 'multiply'],         // a * b
    ['Screen', 'screen'],             // 1 - (1 - a)(1 - b)
    ['Overlay', 'overlay'],           // a < 0.5 ? 2ab : 1 - 2(1 - a)(1 - b)
    ['Hard Light', 'hard'],           // b < 0.5 ? 2ab : 1 - 2(1 - a)(1 - b)
    ['Soft Light', 'soft'],           // (1 - 2b)aa + 2ba
    ['Dodge', 'dodge'],               // a / (1 - b)
    ['Burn', 'burn'],                 // (1 - b) / a
    ['Divide', 'divide'],             // a === b ? 1 : b === 0 ? 0 : a / b
    ['Addition', 'add'],              // a + b
    ['Subtract', 'sub'],              // a - b
    ['Difference', 'diff'],           // b - a
    ['Darken Only', 'darken'],        // min(a, b)
    ['Lighten Only', 'lighten'],      // max(a, b)
  ]),
});

// a * b  = (a * b + 255) >> 8
// 1 - a  = 255 - a
// a / b  = (a * 255) / b


export const ColorOpsTypes = 
{

  // Static

  create: ops.setTypes(ColorOps.create, ColorType),

  // Operations

  maybe: ops.setTypes(ColorOps.maybe, 
    i => {
      if (i.value instanceof ColorType) {
        return i.value;
      }
      if (i.value instanceof OptionalType && i.value.options instanceof ColorType){
        return i.value;
      }
      if (i.value instanceof ManyType) {
        const oneOf = i.value.options.find(t => t instanceof ColorType);
        if (oneOf) {
          return OptionalType.for(oneOf);
        }
        const oneOfOptional = i.value.options.find(t => t instanceof OptionalType && t.options instanceof ColorType);
        if (oneOfOptional) {
          return oneOfOptional;
        }
      }

      return OptionalType.for(ColorType);
    }, 
    { value: AnyType } 
  ),

  cmp: ops.setTypes(ColorOps.cmp, 
    NumberType,
    { value: ColorType, test: ColorType }
  ),

  copy: ops.setTypes(ColorOps.copy, 
    ColorType,
    { value: ColorType }
  ),

  build: ops.setTypes(ColorOps.build, 
    ColorType,
    { r: NumberType, g: NumberType, b: NumberType },
    { a: NumberType }
  ),

  map: ops.setTypes(ColorOps.map, 
    ColorType,
    { value: ColorType, r: NumberType, g: NumberType, b: NumberType },
    { a: NumberType },
    { value: NumberType, component: ColorComponentEnum }
  ),

  op: ops.setTypes(ColorOps.op, 
    ColorType,
    { value: ColorType, test: ColorType, r: NumberType, g: NumberType, b: NumberType },
    { a: NumberType },
    { value: NumberType, test: NumberType, component: ColorComponentEnum }
  ),

  clamp: ops.setTypes(ColorOps.clamp, 
    ColorType,
    { value: ColorType }
  ),

  add: ops.setTypes(ColorOps.add, 
    ColorType,
    { value: ColorType, addend: ColorOrNumber },
    { alpha: BooleanType }
  ),

  adds: ops.setTypes(ColorOps.adds, 
    ColorType,
    { value: ColorType, addend: ColorOrNumber, addendScale: ColorOrNumber },
    { alpha: BooleanType }
  ),

  sub: ops.setTypes(ColorOps.sub, 
    ColorType,
    { value: ColorType, subtrahend: ColorOrNumber },
    { alpha: BooleanType }
  ),

  mul: ops.setTypes(ColorOps.mul, 
    ColorType,
    { value: ColorType, multiplier: ColorOrNumber },
    { alpha: BooleanType }
  ),

  div: ops.setTypes(ColorOps.div, 
    ColorType,
    { value: ColorType, divisor: ColorOrNumber },
    { alpha: BooleanType }
  ),

  mod: ops.setTypes(ColorOps.mod, 
    ColorType,
    { value: ColorType, divisor: ColorOrNumber },
    { alpha: BooleanType }
  ),

  format: ops.setTypes(ColorOps.format, 
    TextType,
    { value: ColorType, format: ColorFormats }
  ),

  parse: ops.setTypes(ColorOps.parse, 
    OptionalType.for(ColorType),
    { value: AnyType }
  ),

  lerp: ops.setTypes(ColorOps.lerp,
    ColorType,
    { start: ColorType, end: ColorType, delta: NumberType }
  ),

  lighten: ops.setTypes(ColorOps.lighten,
    ColorType,
    { value: ColorType, amount: NumberType }
  ),

  darken: ops.setTypes(ColorOps.darken,
    ColorType,
    { value: ColorType, amount: NumberType }
  ),

  toHSL: ops.setTypes(ColorOps.toHSL,
    ColorSpaceHSL.type,
    { value: ColorType }
  ),

  fromHSL: ops.setTypes(ColorOps.fromHSL,
    ColorType,
    { value: ColorSpaceHSL.type }
  ),

  luminance: ops.setTypes(ColorOps.luminance,
    NumberType,
    { value: ColorType }
  ),

  contrast: ops.setTypes(ColorOps.contrast,
    NumberType,
    { value: ColorType, test: ColorType }
  ),

  invert: ops.setTypes(ColorOps.invert,
    ColorType,
    { value: ColorType },
    { alpha: BooleanType }
  ),

  opaque: ops.setTypes(ColorOps.opaque,
    ColorType,
    { value: ColorType }
  ),

  alpha: ops.setTypes(ColorOps.alpha,
    ColorType,
    { value: ColorType, alpha: NumberType }
  ),

  distance: ops.setTypes(ColorOps.distance,
    NumberType,
    { value: ColorType, test: ColorType }
  ),

  named: ops.setTypes(ColorOps.named,
    ColorType,
    { name: ColorNames }
  ),

  getName: ops.setTypes(ColorOps.getName,
    TextType,
    { value: ColorType }
  ),

  blend: ops.setTypes(ColorOps.blend, 
    ColorType,
    { top: ColorType, bottom: ColorType, mode: ColorBlendModes }
  ),

  // Comparisons

  isValid: ops.setTypes(ColorOps.isValid, 
    BooleanType, 
    { value: ColorType }
  ),

  isEqual: ops.setTypes(ColorOps.isEqual, 
    BooleanType,
    { value: ColorType, test: ColorType },
    { epsilon: NumberType }
  ),

  isNotEqual: ops.setTypes(ColorOps.isNotEqual, 
    BooleanType,
    { value: ColorType, test: ColorType },
    { epsilon: NumberType }
  ),

  isLess: ops.setTypes(ColorOps.isLess, 
    BooleanType,
    { value: ColorType, test: ColorType }
  ),

  isLessOrEqual: ops.setTypes(ColorOps.isLessOrEqual, 
    BooleanType,
    { value: ColorType, test: ColorType }
  ),

  isGreater: ops.setTypes(ColorOps.isGreater, 
    BooleanType,
    { value: ColorType, test: ColorType }
  ),

  isGreaterOrEqual: ops.setTypes(ColorOps.isGreaterOrEqual, 
    BooleanType,
    { value: ColorType, test: ColorType }
  ),

  // Casts

  asAny: ops.setTypes(ColorOps.asAny, AnyType, { value: ColorType }),

  asBoolean: ops.setTypes(ColorOps.asBoolean, BooleanType, { value: ColorType }),

  asColor: ops.setTypes(ColorOps.asColor, ColorType, { value: ColorType }),

  asDate: ops.setTypes(ColorOps.asDate, DateType, { value: ColorType }),

  asList: ops.setTypes(ColorOps.asList, i => ListType.forItem(i.value || ColorType), { value: ColorType }),

  asMap: ops.setTypes(ColorOps.asMap, i => MapType.forItem(i.value || ColorType), { value: ColorType }),

  asNumber: ops.setTypes(ColorOps.asNumber, NumberType, { value: ColorType }),

  asObject: ops.setTypes(ColorOps.asObject, i => i.value || ColorType, { value: ColorType }),

  asText: ops.setTypes(ColorOps.asText, TextType, { value: ColorType }),

  asTuple: ops.setTypes(ColorOps.asTuple, i => TupleType.forItem([i.value || ColorType]), { value: ColorType }),

};
