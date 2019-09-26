// import { describe, it, expect } from 'jest';

import { defs, ExpressionBuilder, NumberType, EnumType, ListType, TextType, DateType, MapType, ObjectType, BooleanType, TypeBuilder } from '../src';


// tslint:disable: no-magic-numbers

describe('Constant', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();
  const context = tp.null();

  it('detect type', () =>
  {
    const a = ex.const(0).getType(defs, context);
    expect(a).toBeInstanceOf(EnumType);
    expect(a.options.key).toBeInstanceOf(NumberType);
    expect(a.options.value).toBeInstanceOf(NumberType);

    const b = ex.const('a').getType(defs, context);
    expect(b).toBeInstanceOf(EnumType);
    expect(b.options.key).toBeInstanceOf(TextType);
    expect(b.options.value).toBeInstanceOf(TextType);

    const c = ex.const(['a']).getType(defs, context);
    expect(c).toBeInstanceOf(ListType);
    expect(c.options.item).toBeInstanceOf(TextType);

    const d = ex.const(new Date()).getType(defs, context);
    expect(d).toBeInstanceOf(DateType);

    const e = ex.const(new Map()).getType(defs, context);
    expect(e).toBeInstanceOf(MapType);

    const f = ex.const({ x: 1 }).getType(defs, context);
    expect(f).toBeInstanceOf(ObjectType);
    expect(f.options.props.x).toBeInstanceOf(NumberType);

    const g = ex.const(true).getType(defs, context);
    expect(g).toBeInstanceOf(BooleanType);
  });

})
