// import { describe, it, expect } from 'jest';

import { defs, ObjectType, NumberType, TextType, ExpressionBuilder, DateType, ManyType, TextOps, BooleanType, NumberOps, TypeBuilder } from '../src';


// tslint:disable: no-magic-numbers

describe('Get', () => {

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
    const get = ex.get();
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(ObjectType);
  });

  it('object prop', () =>
  {
    const get = ex.get('num');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('object prop prop', () =>
  {
    const get = ex.get('obj', 'txt');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('object prop merge same', () =>
  {
    const get = ex.get(
      ex.if(ex.get(true))
        .then(ex.const('num'))
        .else(ex.const('num2'))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('object prop merge different', () =>
  {
    const get = ex.get(
      ex.if(ex.get(true))
        .then(ex.const('num'))
        .else(ex.const('obj'))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(ManyType);
    expect(getType.options[0]).toBeInstanceOf(NumberType);
    expect(getType.options[1]).toBeInstanceOf(ObjectType);
  });

  it('object prop merge all same', () =>
  {
    const get = ex.get('obj', 
      ex.op(TextOps.create, {})
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('object prop merge all different', () =>
  {
    const get = ex.get('obj2', 
      ex.op(TextOps.create, {})
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(ManyType);
    expect(getType.options[0]).toBeInstanceOf(TextType);
    expect(getType.options[1]).toBeInstanceOf(NumberType);
  });

  it('enum sub', () =>
  {
    const get = ex.get('enum', 'enumSub');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(BooleanType);
  });

  it('list length', () =>
  {
    const get = ex.get('list', 'length');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('list item at constant', () =>
  {
    const get = ex.get('list', 0);
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(DateType);
  });

  it('list item at dynamic', () =>
  {
    const get = ex.get('list', ex.get('num'));
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(DateType);
  });

  it('list item at one of', () =>
  {
    const get = ex.get('list', 
      ex.if(ex.const(true))
        .then(ex.const(0))
        .else(ex.const(1))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(DateType);
  });

  it('list item at one of', () =>
  {
    const get = ex.get('list', 
      ex.if(ex.const(true))
        .then(ex.const('length'))
        .else(ex.const('length'))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('many list with props', () => 
  {
    const context2 = tp.many(
      tp.list(tp.text()),
      tp.object({
        length: tp.bool(),
        item: tp.date()
      })
    );

    const get1 = ex.get(0);
    const getType1 = get1.getType(defs, context2);

    expect(getType1).toBeInstanceOf(TextType);

    const get2 = ex.get('length');
    const getType2 = get2.getType(defs, context2);

    expect(getType2).toBeInstanceOf(NumberType);

    const get3 = ex.get('item');
    const getType3 = get3.getType(defs, context2);

    expect(getType3).toBeInstanceOf(DateType);

    const get4 = ex.get('missing');
    const getType4 = get4.getType(defs, context2);

    expect(getType4).toBeNull();
  });

  it('map', () => 
  {
    const get1 = ex.get('map', 0);
    const getType1 = get1.getType(defs, context0);

    expect(getType1).toBeInstanceOf(TextType);

    const get2 = ex.get('map', ex.op(NumberOps.create, {}));
    const getType2 = get2.getType(defs, context0);

    expect(getType2).toBeInstanceOf(TextType);

    const get3 = ex.get('map', 'invalidKey');
    const getType3 = get3.getType(defs, context0);

    expect(getType3).toBeNull();

    const get4 = ex.get('map', 0, 1);
    const getType4 = get4.getType(defs, context0);

    expect(getType4).toBeInstanceOf(TextType);
  });

  it('text length', () =>
  {
    const get = ex.get('obj', 'txt', 'length');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('text char at constant', () =>
  {
    const get = ex.get('obj', 'txt', 0);
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('text char at dynamic', () =>
  {
    const get = ex.get('obj', 'txt', ex.op(NumberOps.create, {}));
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('text char at one of', () =>
  {
    const get = ex.get('obj', 'txt', 
      ex.if(ex.const(true))
        .then(ex.const(0))
        .else(ex.const(1))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('tuple length', () =>
  {
    const get = ex.get('tuple', 'length');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('tuple element at constant', () =>
  {
    const get = ex.get('tuple', 1);
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('tuple element at dynamic', () =>
  {
    const get = ex.get('tuple', ex.op(NumberOps.create, {}));
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(ManyType);
    expect(getType.options[0]).toBeInstanceOf(NumberType);
    expect(getType.options[1]).toBeInstanceOf(TextType);
  });

  it('tuple element at one of same', () =>
  {
    const get = ex.get('tuple', 
      ex.if(ex.const(true))
        .then(ex.const(0))
        .else(ex.const(2))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('tuple element at one of different', () =>
  {
    const get = ex.get('tuple', 
      ex.if(ex.const(true))
        .then(ex.const(0))
        .else(ex.const(1))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(ManyType);
    expect(getType.options[0]).toBeInstanceOf(NumberType);
    expect(getType.options[1]).toBeInstanceOf(TextType);
  });

})
