import { Types } from '../../src/Types';
import { Exprs } from '../../src/Exprs';
import { defs } from '../../src/def';
import { TextType } from '../../src/types/Text';
import { ManyType } from '../../src/types/Many';
import { BooleanType } from '../../src/types/Boolean';
import { NumberType } from '../../src/types/Number';

// tslint:disable: no-magic-numbers

describe('Or', () => {

  const context = Types.object({
    a: Types.text(),
    b: Types.number(),
    c: Types.number(),
    d: Types.bool()
  });

  it('type one of', () =>
  {
    const or = Exprs.or(Exprs.get('a'), Exprs.get('b'));
    const orType = or.getType(defs, context);

    expect(orType).toBeInstanceOf(ManyType);
    expect(orType.options[0]).toBeInstanceOf(TextType);
    expect(orType.options[1]).toBeInstanceOf(NumberType);
    expect(orType.options[2]).toBeInstanceOf(BooleanType);
  });

  it('type one of partially same', () =>
  {
    const or = Exprs.or(Exprs.get('c'), Exprs.get('b'));
    const orType = or.getType(defs, context);

    expect(orType).toBeInstanceOf(ManyType);
    expect(orType.options[0]).toBeInstanceOf(NumberType);
    expect(orType.options[1]).toBeInstanceOf(BooleanType);
  });

  it('type one of fully same', () =>
  {
    const or = Exprs.or(Exprs.get('d'));
    const orType = or.getType(defs, context);

    expect(orType).toBeInstanceOf(BooleanType);
  });

})
