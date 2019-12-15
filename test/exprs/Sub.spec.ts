// import { describe, it, expect } from 'jest';

import { defs, ObjectType, NumberType, TextType, ExpressionBuilder, TypeBuilder } from '../../src';


// tslint:disable: no-magic-numbers

describe('Sub', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();

  const context0 = tp.object({
    num: tp.number(),
    num2: tp.number(),
    list: tp.list(tp.date()),
    obj: tp.object({
      txt: tp.text()
    }),
    obj2: tp.object({
      txt: tp.text(),
      num: tp.number(),
    }),
    enum: tp.enum(
      tp.object({
        enumSub: tp.bool()
      })
    ),
    map: tp.map(tp.text(), tp.number()),
    tuple: tp.tuple(
      tp.number(),
      tp.text(),
      tp.number(),
    ),
  })

  it('root', () =>
  {
    const sub = ex.sub(ex.get());
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(ObjectType);
  });

  it('object prop', () =>
  {
    const sub = ex.sub(ex.get('num'));
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(NumberType);
  });

  it('object sub', () =>
  {
    const sub = ex.sub(ex.get(), 'num');
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(NumberType);
  });

  it('object prop prop', () =>
  {
    const sub = ex.sub(ex.get('obj', 'txt'));
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(TextType);
  });

  it('object sub sub', () =>
  {
    const sub = ex.sub(ex.get(), 'obj', 'txt');
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(TextType);
  });

  it('object prop sub', () =>
  {
    const sub = ex.sub(ex.get('obj'), 'txt');
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(TextType);
  });


})
