// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, ObjectType, TextType, NumberType, defs, ManyType } from '../src';


// tslint:disable: no-magic-numbers

describe('If', () => {

  const ex = new ExpressionBuilder();
  const context = ObjectType.from({
    a: TextType,
    b: NumberType,
    c: NumberType
  });

  it('type one of', () =>
  {
    const iif = ex
      .if(ex.const(true))
      .then(ex.get('a'))
      .else(ex.get('b'))
    ;
    const iffType = iif.getType(defs, context);

    expect(iffType).toBeInstanceOf(ManyType);
    expect(iffType.options[0]).toBeInstanceOf(TextType);
    expect(iffType.options[1]).toBeInstanceOf(NumberType);
  });

})
