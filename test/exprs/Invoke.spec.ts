// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, TextType, NumberType, defs, TypeBuilder } from '../../src';


// tslint:disable: no-magic-numbers

describe('Invoke', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.object({
    a: tp.text(),
    b: tp.number(),
    c: tp.number()
  });

  it('type one of', () =>
  {
    const FUNC_NAME = 'Invoke#type one of';

    defs.addFunction(FUNC_NAME, 
      NumberType, {
        value: TextType
      },
      ex.get('value', 'length')
    );

    const func = ex.invoke(FUNC_NAME, {
      value: ex.get('a')
    });
    const funcType = func.getType(defs, context);

    expect(funcType).toBeInstanceOf(NumberType);
  });

})
