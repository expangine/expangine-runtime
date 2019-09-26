// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, defs, NumberType, TypeBuilder } from '../src';


// tslint:disable: no-magic-numbers

describe('Return', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.null();

  it('type none', () =>
  {
    const ret = ex.return();
    const retType = ret.getType(defs, context);

    expect(retType).toBeNull();
  });

  it('type value', () =>
  {
    const ret = ex.return(ex.const(1));
    const retType = ret.getType(defs, context).getSimplifiedType();

    expect(retType).toBeInstanceOf(NumberType);
  });

})
