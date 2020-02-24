import { Types, Exprs, defs, BooleanType } from '../../src';


// tslint:disable: no-magic-numbers

describe('Update', () => {

  const context = Types.null();

  it('type', () =>
  {
    const not = Exprs.update('a', 'b').to(Exprs.const(1));
    const notType = not.getType(defs, context);

    expect(notType).toBeInstanceOf(BooleanType);
  });

})
