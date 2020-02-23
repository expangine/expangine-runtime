import { Types } from '../../src/Types';
import { Exprs } from '../../src/Exprs';
import { OptionalType } from '../../src/types/Optional';
import { BooleanType } from '../../src/types/Boolean';
import { defs } from '../../src/def';
import { TextType } from '../../src/types/Text';
import { NumberType } from '../../src/types/Number';


// tslint:disable: no-magic-numbers

describe('For', () => {

  const context = Types.object({
    a: Types.text(),
    b: Types.number(),
  });

  it('type constant', () =>
  {
    const loop = Exprs.for('i', 0, 1, Exprs.const(false));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(BooleanType);
  });

  it('type dynamic', () =>
  {
    const loop = Exprs.for('i', 0, 1, Exprs.get('a'));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(TextType);
  });

  it('type from var', () =>
  {
    const loop = Exprs.for('i', 0, 1, Exprs.get('i'));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(NumberType);
  });

  it('type from break', () =>
  {
    const loop = Exprs.for('i', 0, 1, Exprs.get('break'));
    const loopType = loop.getType(defs, context);

    expect(loopType).toBeInstanceOf(OptionalType);
    expect(loopType.options).toBeInstanceOf(BooleanType);
  });

})
