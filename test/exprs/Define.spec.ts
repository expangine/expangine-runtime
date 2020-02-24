import { Types, Exprs, defs, EnumType, TextType, NumberType } from '../../src';


// tslint:disable: no-magic-numbers

describe('Define', () => {

  const context = Types.object({
    name: Types.text(),
    age: Types.number(),
  })

  it('type constant', () =>
  {
    const def = Exprs.define({
      a: Exprs.const(0)
    }).run(
      Exprs.const('')
    );
    const defType = def.getType(defs, context);

    expect(defType).toBeInstanceOf(EnumType);
    expect(defType.options.value).toBeInstanceOf(TextType);
  });

  it('type dynamic', () =>
  {
    const def = Exprs.define({
      a: Exprs.const(0)
    }).run(
      Exprs.get('a')
    );
    const defType = def.getType(defs, context);

    expect(defType).toBeInstanceOf(EnumType);
    expect(defType.options.value).toBeInstanceOf(NumberType);
  });

})
