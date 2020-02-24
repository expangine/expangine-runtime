import { Types, Exprs, defs, NullType } from '../../src';

// tslint:disable: no-magic-numbers

describe('No', () => {

  const context = Types.null();

  it('type', () =>
  {
    const no = Exprs.noop();
    const noType = no.getType(defs, context);

    expect(noType).toEqual(NullType.baseType);
  });

})
