import { Types } from '../../src/Types';
import { Exprs } from '../../src/Exprs';
import { defs } from '../../src/def';
import { BooleanType } from '../../src/types/Boolean';

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
