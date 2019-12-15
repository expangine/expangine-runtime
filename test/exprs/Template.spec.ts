// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, defs, TextType, TypeBuilder } from '../../src';


// tslint:disable: no-magic-numbers

describe('Template', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.null();

  it('type', () =>
  {
    const tmpl = ex.template('Hello {a}!', {
      a: ex.const('World')
    });
    const tmplType = tmpl.getType(defs, context);

    expect(tmplType).toBeInstanceOf(TextType);
  });

})
