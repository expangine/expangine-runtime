// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, defs, NullType } from '../src';


// tslint:disable: no-magic-numbers

describe('No', () => {

  const ex = new ExpressionBuilder();
  const context = NullType.baseType;

  it('type', () =>
  {
    const no = ex.noop();
    const noType = no.getType(defs, context);

    expect(noType).toBeNull();
  });

})
