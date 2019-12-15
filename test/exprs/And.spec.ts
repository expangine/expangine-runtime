// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, defs, BooleanType, TypeBuilder, ValidationType, ValidationSeverity } from '../../src';
import { validate } from '../helpers';


// tslint:disable: no-magic-numbers

describe('And', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.null();

  it('type', () =>
  {
    const not = ex.and(ex.const(2), ex.const(false));
    const notType = not.getType(defs, context);

    expect(notType).toBeInstanceOf(BooleanType);
  });

  it('validate', () =>
  {
    expect(
      validate(
        ex.and(), 
        tp.object()
      )
    ).toEqual([]);

    expect(
      validate(
        ex.and(ex.get('x'), ex.get('y')),
        tp.object({
          x: tp.bool(),
          y: tp.bool()
        })
      )
    ).toEqual([]);

    const d0 = ex.const('x');
    const a0 = ex.get(d0);
    const b0 = ex.and(a0);
    const c0 = tp.object();
    expect(
      validate(b0, c0)
    ).toEqual([{
      type: ValidationType.INCOMPATIBLE_TYPES,
      severity: ValidationSeverity.HIGH,
      context: c0,
      subject: a0,
      parent: b0,
    }, {
      type: ValidationType.INVALID_EXPRESSION,
      severity: ValidationSeverity.HIGH,
      context: c0,
      subject: d0,
      parent: a0,
    }]);
  });

})
