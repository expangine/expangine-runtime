// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, TextType, defs, OptionalType, BooleanType, TypeBuilder } from '../../src';


// tslint:disable: no-magic-numbers

describe('Do', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.object({
    a: tp.text(),
    b: tp.number(),
  });

  it('type constant', () =>
  {
    const loop = ex.do(ex.const(true), ex.const(false));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(BooleanType);
  });

  it('type dynamic', () =>
  {
    const loop = ex.do(ex.get('a'), ex.const(false));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(TextType);
  });

  it('type from break', () =>
  {
    const loop = ex.do(ex.get('break'), ex.const(false));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(BooleanType);
  });

})
