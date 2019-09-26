// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, defs, NullType, BooleanType } from '../src';


// tslint:disable: no-magic-numbers

describe('And', () => {

  const ex = new ExpressionBuilder();
  const context = NullType.baseType;

  it('type', () =>
  {
    const not = ex.and(ex.const(2), ex.const(false));
    const notType = not.getType(defs, context);

    expect(notType).toBeInstanceOf(BooleanType);
  });

})
