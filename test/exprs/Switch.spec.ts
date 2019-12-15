// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, TextType, NumberType, defs, NumberOps, EnumType, ManyType, TypeBuilder } from '../../src';


// tslint:disable: no-magic-numbers

describe('If', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.object({
    a: tp.text(),
    b: tp.number(),
    c: tp.number()
  });

  it('type one of same', () =>
  {
    const switchs = ex
      .switch(ex.get('a', 'length'), NumberOps.isEqual)
      .case(ex.get(0))
      .case(ex.get(1))
      .case(ex.get(2))
      .than(ex.const('a'))
      .case(ex.get(3))
      .than(ex.const('b'))
      .default(ex.const('c'))
    ;
    const switchsType = switchs.getType(defs, context);
    const switchsSimplified = switchsType.getSimplifiedType();

    expect(switchsSimplified).toBeInstanceOf(TextType);
    expect(switchsType).toBeInstanceOf(EnumType);
    expect(switchsType.options.value).toBeInstanceOf(TextType);
    expect(switchsType.options.constants).toEqual(new Map([
      ['a', 'a'],
      ['b', 'b'],
      ['c', 'c']
    ]));
  });

  it('type one of many', () =>
  {
    const switchs = ex
      .switch(ex.get('a', 'length'), NumberOps.isEqual)
      .case(ex.get(0))
      .case(ex.get(1))
      .case(ex.get(2))
      .than(ex.const('a'))
      .case(ex.get(3))
      .than(ex.const('b'))
      .default(ex.const(0))
    ;
    const switchsType = switchs.getType(defs, context);

    expect(switchsType).toBeInstanceOf(EnumType);
    expect(switchsType.options.value).toBeInstanceOf(ManyType);
    expect(switchsType.options.value.options[0]).toBeInstanceOf(TextType);
    expect(switchsType.options.value.options[1]).toBeInstanceOf(NumberType);
    expect(switchsType.options.key).toBeInstanceOf(ManyType);
    expect(switchsType.options.key.options[0]).toBeInstanceOf(TextType);
    expect(switchsType.options.key.options[1]).toBeInstanceOf(NumberType);
    expect(switchsType.options.constants).toEqual(new Map<any, any>([
      ['a', 'a'],
      ['b', 'b'],
      [0, 0]
    ]));
  });

  it('type one of same non-constant', () =>
  {
    const switchs = ex
      .switch(ex.get('a', 'length'), NumberOps.isEqual)
      .case(ex.get(0))
      .case(ex.get(1))
      .case(ex.get(2))
      .than(ex.op(NumberOps.rnd, {}))
      .case(ex.get(3))
      .than(ex.op(NumberOps.pi, {}))
      .default(ex.op(NumberOps.create, {}))
    ;
    const switchsType = switchs.getType(defs, context);

    expect(switchsType).toBeInstanceOf(NumberType);
  });


})
