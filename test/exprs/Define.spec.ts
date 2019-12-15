import { ExpressionBuilder, defs, TextType, NumberType, EnumType, TypeBuilder } from '../../src';

// import { describe, it, expect } from 'jest';


// tslint:disable: no-magic-numbers

describe('Define', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.object({
    name: tp.text(),
    age: tp.number(),
  })

  it('type constant', () =>
  {
    const def = ex.define({
      a: ex.const(0)
    }).run(
      ex.const('')
    );
    const defType = def.getType(defs, context);

    expect(defType).toBeInstanceOf(EnumType);
    expect(defType.options.value).toBeInstanceOf(TextType);
  });

  it('type dynamic', () =>
  {
    const def = ex.define({
      a: ex.const(0)
    }).run(
      ex.get('a')
    );
    const defType = def.getType(defs, context);

    expect(defType).toBeInstanceOf(EnumType);
    expect(defType.options.value).toBeInstanceOf(NumberType);
  });

})
