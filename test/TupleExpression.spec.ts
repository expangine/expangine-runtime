// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, defs, NumberType, TypeBuilder, TupleType, DateType } from '../src';


// tslint:disable: no-magic-numbers

describe('TupleExpression', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.object({
    x: tp.number(),
    y: tp.text(),
    z: tp.date(),
  });

  it('type', () =>
  {
    const tuple = ex.tuple(
      ex.get('x'),
      ex.const(0),
      ex.get('z'),
    );
    const tupleType = tuple.getType(defs, context);

    expect(tupleType).toBeInstanceOf(TupleType);
    expect(tupleType.options[0]).toBeInstanceOf(NumberType);
    expect(tupleType.options[1]).toBeInstanceOf(NumberType);
    expect(tupleType.options[2]).toBeInstanceOf(DateType);
  });

})
