import { Types } from '../../src/Types';
import { Exprs } from '../../src/Exprs';
import { defs } from '../../src/def';
import { OptionalType } from '../../src/types/Optional';
import { BooleanType } from '../../src/types/Boolean';
import { TextType } from '../../src/types/Text';

// tslint:disable: no-magic-numbers

describe('While', () => {

  const context = Types.object({
    a: Types.text(),
    b: Types.number(),
  });

  it('type constant', () =>
  {
    const loop = Exprs.while(Exprs.const(false), Exprs.const(true));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(BooleanType);
  });

  it('type dynamic', () =>
  {
    const loop = Exprs.while(Exprs.const(false), Exprs.get('a'));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(TextType);
  });

  it('type from break', () =>
  {
    const loop = Exprs.while(Exprs.const(false), Exprs.get('break'));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(BooleanType);
  });

})
