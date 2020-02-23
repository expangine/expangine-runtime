import { Types } from '../../src/Types';
import { Exprs } from '../../src/Exprs';
import { BooleanType } from '../../src/types/Boolean';
import { defs } from '../../src/def';

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
