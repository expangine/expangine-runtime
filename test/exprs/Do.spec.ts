import { Types, Exprs, defs, OptionalType, BooleanType, TextType } from '../../src';


// tslint:disable: no-magic-numbers

describe('Do', () => {

  const context = Types.object({
    a: Types.text(),
    b: Types.number(),
  });

  it('type constant', () =>
  {
    const loop = Exprs.do(Exprs.const(true), Exprs.const(false));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(BooleanType);
  });

  it('type dynamic', () =>
  {
    const loop = Exprs.do(Exprs.get('a'), Exprs.const(false));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(TextType);
  });

})
