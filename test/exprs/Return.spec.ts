import { Types, Exprs, defs, NullType, NumberType } from '../../src';


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
    const retType = ret.getType(defs, context)?.getSimplifiedType();

    expect(retType).toBeInstanceOf(NumberType);
  });

})
