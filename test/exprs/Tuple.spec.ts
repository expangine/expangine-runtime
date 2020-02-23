import { Types } from '../../src/Types';
import { Exprs } from '../../src/Exprs';
import { defs } from '../../src/def';
import { TupleType } from '../../src/types/Tuple';
import { NumberType } from '../../src/types/Number';
import { DateType } from '../../src/types/Date';

// tslint:disable: no-magic-numbers

describe('TupleExpression', () => {

  const context = Types.object({
    x: Types.number(),
    y: Types.text(),
    z: Types.date(),
  });

  it('type', () =>
  {
    const tuple = Exprs.tuple(
      Exprs.get('x'),
      Exprs.const(0),
      Exprs.get('z'),
    );
    const tupleType = tuple.getType(defs, context);

    expect(tupleType).toBeInstanceOf(TupleType);
    expect(tupleType.options[0]).toBeInstanceOf(NumberType);
    expect(tupleType.options[1]).toBeInstanceOf(NumberType);
    expect(tupleType.options[2]).toBeInstanceOf(DateType);
  });

})
