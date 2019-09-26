// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, defs, NullType, BooleanType } from '../src';


// tslint:disable: no-magic-numbers

describe('Set', () => {

  const ex = new ExpressionBuilder();
  const context = NullType.baseType;

  it('type', () =>
  {
    const not = ex.set('a', 'b').to(ex.const(1));
    const notType = not.getType(defs, context);

    expect(notType).toBeInstanceOf(BooleanType);
  });

})
