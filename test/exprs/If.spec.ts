import { Types, Exprs, defs, ManyType, TextType, NumberType } from '../../src';


// tslint:disable: no-magic-numbers

describe('If', () => {

  const context = Types.object({
    a: Types.text(),
    b: Types.number(),
    c: Types.number(),
  });

  it('type one of', () =>
  {
    const iif = Exprs
      .if(Exprs.const(true))
      .than(Exprs.get('a'))
      .else(Exprs.get('b'))
    ;
    const iffType = iif.getType(defs, context);

    expect(iffType).toBeInstanceOf(ManyType);
    expect(iffType.options[0]).toBeInstanceOf(TextType);
    expect(iffType.options[1]).toBeInstanceOf(NumberType);
  });

  it('type simplify', () =>
  {
    const iif = Exprs
      .if(Exprs.const(true))
      .than(Exprs.const(0))
      .else(Exprs.const(1))
    ;
    const iffType = iif.getType(defs, context).getSimplifiedType();

    expect(iffType).toBeInstanceOf(NumberType);
  });

})
