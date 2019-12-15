// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, TextType, NumberType, defs, OptionalType, BooleanType, TypeBuilder } from '../../src';


// tslint:disable: no-magic-numbers

describe('For', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.object({
    a: tp.text(),
    b: tp.number(),
  });

  it('type constant', () =>
  {
    const loop = ex.for('i', 0, 1, ex.const(false));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(BooleanType);
  });

  it('type dynamic', () =>
  {
    const loop = ex.for('i', 0, 1, ex.get('a'));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(TextType);
  });

  it('type from var', () =>
  {
    const loop = ex.for('i', 0, 1, ex.get('i'));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(NumberType);
  });

  it('type from break', () =>
  {
    const loop = ex.for('i', 0, 1, ex.get('break'));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(BooleanType);
  });

})
