import { Types } from '../../src/Types';
import { Exprs } from '../../src/Exprs';
import { defs } from '../../src/def';
import { TextType } from '../../src/types/Text';

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
