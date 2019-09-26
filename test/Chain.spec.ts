// import { describe, it, expect } from 'jest';

import { defs, ExpressionBuilder, ObjectType, NumberType, TextType } from '../src';


// tslint:disable: no-magic-numbers

describe('Chain', () => {

  const ex = new ExpressionBuilder();

  const context = ObjectType.from({
    a: NumberType,
    b: TextType
  });

  it('type last', () =>
  {
    const chain = ex.body(
      ex.get('a'),
      ex.get('b')
    );
    const chainType = chain.getType(defs, context);

    expect(chainType).toBeInstanceOf(TextType);
  });

  it('type last 2', () =>
  {
    const chain = ex.body(
      ex.get('b'),
      ex.get('a')
    );
    const chainType = chain.getType(defs, context);

    expect(chainType).toBeInstanceOf(NumberType);
  });

})
