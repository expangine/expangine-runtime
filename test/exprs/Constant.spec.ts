import { Types, Exprs, defs, EnumType, NumberType, TextType, ListType, DateType, MapType, ObjectType, BooleanType } from '../../src';

// tslint:disable: no-magic-numbers

describe('Constant', () => {

  const context = Types.null();

  it('detect type', () =>
  {
    const a = Exprs.const(0).getType(defs, context);
    expect(a).toBeInstanceOf(EnumType);
    expect(a.options.key).toBeInstanceOf(NumberType);
    expect(a.options.value).toBeInstanceOf(NumberType);

    const b = Exprs.const('a').getType(defs, context);
    expect(b).toBeInstanceOf(EnumType);
    expect(b.options.key).toBeInstanceOf(TextType);
    expect(b.options.value).toBeInstanceOf(TextType);

    const c = Exprs.const(['a']).getType(defs, context);
    expect(c).toBeInstanceOf(ListType);
    expect(c.options.item).toBeInstanceOf(TextType);

    const d = Exprs.const(new Date()).getType(defs, context);
    expect(d).toBeInstanceOf(DateType);

    const e = Exprs.const(new Map()).getType(defs, context);
    expect(e).toBeInstanceOf(MapType);

    const f = Exprs.const({ x: 1 }).getType(defs, context);
    expect(f).toBeInstanceOf(ObjectType);
    expect(f.options.props.x).toBeInstanceOf(NumberType);

    const g = Exprs.const(true).getType(defs, context);
    expect(g).toBeInstanceOf(BooleanType);
  });

})
