import { Types, Exprs, defs, BooleanType } from '../../src';

// tslint:disable: no-magic-numbers

describe('Not', () => {

  const context = Types.null();

  it('type', () =>
  {
    const not = Exprs.not(Exprs.const(2));
    const notType = not.getType(defs, context);

    expect(notType).toBeInstanceOf(BooleanType);
  });

})
