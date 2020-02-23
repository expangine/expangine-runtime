import { Exprs } from '../../src/Exprs';
import { Types } from '../../src/Types';
import { defs } from '../../src/def';
import { NullType } from '../../src/types/Null';
import { NumberType } from '../../src/types/Number';

// tslint:disable: no-magic-numbers

describe('Return', () => {

  const context = Types.null();

  it('type none', () =>
  {
    const ret = Exprs.return();
    const retType = ret.getType(defs, context);

    expect(retType).toEqual(NullType.baseType);
  });

  it('type value', () =>
  {
    const ret = Exprs.return(Exprs.const(1));
    const retType = ret.getType(defs, context).getSimplifiedType();

    expect(retType).toBeInstanceOf(NumberType);
  });

})
