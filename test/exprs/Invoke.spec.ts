import { Types } from '../../src/Types';
import { defs } from '../../src/def';
import { Exprs } from '../../src/Exprs';
import { NumberType } from '../../src/types/Number';

// tslint:disable: no-magic-numbers

describe('Invoke', () => {

  const context = Types.object({
    a: Types.text(),
    b: Types.number(),
    c: Types.number()
  });

  it('type one of', () =>
  {
    const FUNC_NAME = 'Invoke#type one of';

    defs.addFunction({
      name: FUNC_NAME, 
      params: Types.object({
        value: Types.text(),
      }),
      expression: Exprs.get('value', 'length'),
    });

    const func = Exprs.invoke(FUNC_NAME, {
      value: Exprs.get('a')
    });
    const funcType = func.getType(defs, context);

    expect(funcType).toBeInstanceOf(NumberType);
  });

})
