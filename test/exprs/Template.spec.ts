import { Types, Exprs, defs, TextType } from '../../src';


// tslint:disable: no-magic-numbers

describe('Template', () => {

  const context = Types.null();

  it('type', () =>
  {
    const tmpl = Exprs.template('Hello {a}!', {
      a: Exprs.const('World')
    });
    const tmplType = tmpl.getType(defs, context);

    expect(tmplType).toBeInstanceOf(TextType);
  });

})
