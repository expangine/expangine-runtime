// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, ObjectType, TextType, NumberType, defs } from '../src';


// tslint:disable: no-magic-numbers

describe('Invoke', () => {

  const ex = new ExpressionBuilder();
  const context = ObjectType.from({
    a: TextType,
    b: NumberType,
    c: NumberType
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
