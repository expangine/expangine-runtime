// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, defs, NullType, BooleanType } from '../src';


// tslint:disable: no-magic-numbers

describe('Not', () => {

  const ex = new ExpressionBuilder();
  const context = NullType.baseType;

  it('type', () =>
  {
    const not = ex.not(ex.const(2));
    const notType = not.getType(defs, context);

    expect(notType).toBeInstanceOf(BooleanType);
  });

})
