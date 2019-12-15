
import { Type, Expression, Validation, defs } from '../src';


export function validate(expr: Expression, context: Type): Validation[]
{
  const validations: Validation[] = [];

  expr.validate(defs, context, v => validations.push(v));

  return validations;
}

describe('helpers', () => {
  it('exists', () => {});
});
