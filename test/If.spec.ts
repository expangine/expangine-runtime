// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, TextType, NumberType, defs, ManyType, TypeBuilder } from '../src';


// tslint:disable: no-magic-numbers

describe('If', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.object({
    a: tp.text(),
    b: tp.number(),
    c: tp.number(),
  });

  it('type one of', () =>
  {
    const iif = ex
      .if(ex.const(true))
      .than(ex.get('a'))
      .else(ex.get('b'))
    ;
    const iffType = iif.getType(defs, context);

    expect(iffType).toBeInstanceOf(ManyType);
    expect(iffType.options[0]).toBeInstanceOf(TextType);
    expect(iffType.options[1]).toBeInstanceOf(NumberType);
  });

  it('type simplify', () =>
  {
    const iif = ex
      .if(ex.const(true))
      .than(ex.const(0))
      .else(ex.const(1))
    ;
    const iffType = iif.getType(defs, context).getSimplifiedType();

    expect(iffType).toBeInstanceOf(NumberType);
  });

})
