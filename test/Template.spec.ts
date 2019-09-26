// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, defs, NullType, TextType } from '../src';


// tslint:disable: no-magic-numbers

describe('Template', () => {

  const ex = new ExpressionBuilder();
  const context = NullType.baseType;

  it('type', () =>
  {
    const tmpl = ex.template('Hello {a}!', {
      a: ex.const('World')
    });
    const tmplType = tmpl.getType(defs, context);

    expect(tmplType).toBeInstanceOf(TextType);
  });

})
