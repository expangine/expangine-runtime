import { Types } from '../../src/Types';
import { Exprs } from '../../src/Exprs';
import { NumberOps } from '../../src/ops/NumberOps';
import { defs } from '../../src/def';
import { TextType } from '../../src/types/Text';
import { EnumType } from '../../src/types/Enum';
import { ManyType } from '../../src/types/Many';
import { NumberType } from '../../src/types/Number';

// tslint:disable: no-magic-numbers

describe('If', () => {

  const context = Types.object({
    a: Types.text(),
    b: Types.number(),
    c: Types.number()
  });

  it('type one of same', () =>
  {
    const switchs = Exprs
      .switch(Exprs.get('a', 'length'), NumberOps.isEqual)
      .case(Exprs.get(0))
      .case(Exprs.get(1))
      .case(Exprs.get(2))
      .than(Exprs.const('a'))
      .case(Exprs.get(3))
      .than(Exprs.const('b'))
      .default(Exprs.const('c'))
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
    const switchs = Exprs
      .switch(Exprs.get('a', 'length'), NumberOps.isEqual)
      .case(Exprs.get(0))
      .case(Exprs.get(1))
      .case(Exprs.get(2))
      .than(Exprs.const('a'))
      .case(Exprs.get(3))
      .than(Exprs.const('b'))
      .default(Exprs.const(0))
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
    const switchs = Exprs
      .switch(Exprs.get('a', 'length'), NumberOps.isEqual)
      .case(Exprs.get(0))
      .case(Exprs.get(1))
      .case(Exprs.get(2))
      .than(Exprs.op(NumberOps.rnd, {}))
      .case(Exprs.get(3))
      .than(Exprs.op(NumberOps.pi, {}))
      .default(Exprs.op(NumberOps.create, {}))
    ;
    const switchsType = switchs.getType(defs, context);

    expect(switchsType).toBeInstanceOf(NumberType);
  });


})
