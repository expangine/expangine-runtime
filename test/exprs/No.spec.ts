import { Types } from '../../src/Types';
import { Exprs } from '../../src/Exprs';
import { NullType } from '../../src/types/Null';
import { defs } from '../../src/def';

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
