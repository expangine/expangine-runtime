// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, ObjectType, TextType, NumberType, defs, OptionalType, BooleanType } from '../src';


// tslint:disable: no-magic-numbers

describe('While', () => {

  const ex = new ExpressionBuilder();
  const context = ObjectType.from({
    a: TextType,
    b: NumberType
  });

  it('type constant', () =>
  {
    const loop = ex.while(ex.const(false), ex.const(true));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(BooleanType);
  });

  it('type dynamic', () =>
  {
    const loop = ex.while(ex.const(false), ex.get('a'));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(TextType);
  });

  it('type from break', () =>
  {
    const loop = ex.while(ex.const(false), ex.get('break'));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(BooleanType);
  });

})
