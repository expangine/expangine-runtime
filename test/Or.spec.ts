// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, ObjectType, TextType, NumberType, defs, ManyType, BooleanType } from '../src';


// tslint:disable: no-magic-numbers

describe('Or', () => {

  const ex = new ExpressionBuilder();
  const context = ObjectType.from({
    a: TextType,
    b: NumberType,
    c: NumberType,
    d: BooleanType
  });

  it('type one of', () =>
  {
    const or = ex.or(ex.get('a'), ex.get('b'));
    const orType = or.getType(defs, context);

    expect(orType).toBeInstanceOf(ManyType);
    expect(orType.options[0]).toBeInstanceOf(TextType);
    expect(orType.options[1]).toBeInstanceOf(NumberType);
    expect(orType.options[2]).toBeInstanceOf(BooleanType);
  });

  it('type one of partially same', () =>
  {
    const or = ex.or(ex.get('c'), ex.get('b'));
    const orType = or.getType(defs, context);

    expect(orType).toBeInstanceOf(ManyType);
    expect(orType.options[0]).toBeInstanceOf(NumberType);
    expect(orType.options[1]).toBeInstanceOf(BooleanType);
  });

  it('type one of fully same', () =>
  {
    const or = ex.or(ex.get('d'));
    const orType = or.getType(defs, context);

    expect(orType).toBeInstanceOf(BooleanType);
  });

})
