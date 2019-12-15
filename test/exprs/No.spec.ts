// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, defs, TypeBuilder } from '../../src';


// tslint:disable: no-magic-numbers

describe('No', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.null();

  it('type', () =>
  {
    const no = ex.noop();
    const noType = no.getType(defs, context);

    expect(noType).toBeNull();
  });

})
