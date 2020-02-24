import { Types, Exprs, defs, TextType, NumberType } from '../../src';


// tslint:disable: no-magic-numbers

describe('Chain', () => {

  const context = Types.object({
    a: Types.number(),
    b: Types.text()
  });

  it('type last', () =>
  {
    const chain = Exprs.body(
      Exprs.get('a'),
      Exprs.get('b')
    );
    const chainType = chain.getType(defs, context);

    expect(chainType).toBeInstanceOf(TextType);
  });

  it('type last 2', () =>
  {
    const chain = Exprs.body(
      Exprs.get('b'),
      Exprs.get('a')
    );
    const chainType = chain.getType(defs, context);

    expect(chainType).toBeInstanceOf(NumberType);
  });

})
