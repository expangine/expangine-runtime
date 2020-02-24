import { Types, Exprs, defs, BooleanType, ValidationType, ValidationSeverity } from '../../src';


// tslint:disable: no-magic-numbers

describe('And', () => {

  const context = Types.null();

  it('type', () =>
  {
    const not = Exprs.and(Exprs.const(2), Exprs.const(false));
    const notType = not.getType(defs, context);

    expect(notType).toBeInstanceOf(BooleanType);
  });

  it('validate', () =>
  {
    expect(
      Exprs.and().validations(
        defs, 
        Types.object()
      )
    ).toEqual([]);

    expect(
      Exprs.and(Exprs.get('x'), Exprs.get('y')).validations(
        defs,
        Types.object({
          x: Types.bool(),
          y: Types.bool()
        })
      )
    ).toEqual([]);

    const d0 = Exprs.const('x');
    const a0 = Exprs.get(d0);
    const b0 = Exprs.and(a0);
    const c0 = Types.object();

    expect(
      b0.validations(defs, c0)
    ).toEqual([{
      type: ValidationType.INCOMPATIBLE_TYPES,
      severity: ValidationSeverity.HIGH,
      context: c0,
      subject: a0,
      parent: b0,
      expected: BooleanType.baseType,
    }, {
      type: ValidationType.INVALID_EXPRESSION,
      severity: ValidationSeverity.HIGH,
      context: c0,
      subject: d0,
      parent: a0,
    }]);
  });

})
