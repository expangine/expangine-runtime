import { Types, Exprs, defs, ObjectType, NumberType, TextType, ManyType, TextOps, BooleanType, OptionalType, DateType, NumberOps } from '../../src';


// tslint:disable: no-magic-numbers

describe('Get', () => {

  const context0 = Types.object({
    num: Types.number(),
    num2: Types.number(),
    list: Types.list(Types.date()),
    list2: Types.list(Types.text(), 2),
    obj: Types.object({
      txt: Types.text()
    }),
    obj2: Types.object({
      txt: Types.text(),
      num: Types.number(),
    }),
    enum: Types.enum(
      Types.object({
        enumSub: Types.bool()
      })
    ),
    map: Types.map(Types.text(), Types.number()),
    tuple: Types.tuple(
      Types.number(),
      Types.text(),
      Types.number(),
    ),
  })

  it('root', () =>
  {
    const get = Exprs.get();
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(ObjectType);
  });

  it('object prop', () =>
  {
    const get = Exprs.get('num');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('object prop prop', () =>
  {
    const get = Exprs.get('obj', 'txt');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('object prop merge same', () =>
  {
    const get = Exprs.get(
      Exprs.if(Exprs.get(true))
        .than(Exprs.const('num'))
        .else(Exprs.const('num2'))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('object prop merge different', () =>
  {
    const get = Exprs.get(
      Exprs.if(Exprs.get(true))
        .than(Exprs.const('num'))
        .else(Exprs.const('obj'))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(ManyType);
    expect(getType.options[0]).toBeInstanceOf(NumberType);
    expect(getType.options[1]).toBeInstanceOf(ObjectType);
  });

  it('object prop merge all same', () =>
  {
    const get = Exprs.get('obj', 
      Exprs.op(TextOps.create, {})
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('object prop merge all different', () =>
  {
    const get = Exprs.get('obj2', 
      Exprs.op(TextOps.create, {})
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(ManyType);
    expect(getType.options[0]).toBeInstanceOf(TextType);
    expect(getType.options[1]).toBeInstanceOf(NumberType);
  });

  it('enum sub', () =>
  {
    const get = Exprs.get('enum', 'enumSub');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(BooleanType);
  });

  it('list length', () =>
  {
    const get = Exprs.get('list', 'length');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('list item at constant', () =>
  {
    const get = Exprs.get('list', 0);
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(OptionalType);
    expect(getType.options).toBeInstanceOf(DateType);
  });

  it('list item at constant with min', () =>
  {
    const get = Exprs.get('list2', 0);
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('list item at dynamic', () =>
  {
    const get = Exprs.get('list', Exprs.get('num'));
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(OptionalType);
    expect(getType.options).toBeInstanceOf(DateType);
  });

  it('list item at dynamic with min', () =>
  {
    const get = Exprs.get('list2', Exprs.get('num'));
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(OptionalType);
    expect(getType.options).toBeInstanceOf(TextType);
  });

  it('list item at one of', () =>
  {
    const get = Exprs.get('list', 
      Exprs.if(Exprs.const(true))
        .than(Exprs.const(0))
        .else(Exprs.const(1))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(OptionalType);
    expect(getType.options).toBeInstanceOf(DateType);
  });

  it('list item at one of with min', () =>
  {
    const get = Exprs.get('list2', 
      Exprs.if(Exprs.const(true))
        .than(Exprs.const(0))
        .else(Exprs.const(1))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('list item at one of', () =>
  {
    const get = Exprs.get('list', 
      Exprs.if(Exprs.const(true))
        .than(Exprs.const('length'))
        .else(Exprs.const('length'))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('many list with props', () => 
  {
    const context2 = Types.many(
      Types.list(Types.text()),
      Types.object({
        length: Types.bool(),
        item: Types.date()
      })
    );

    const get1 = Exprs.get(0);
    const getType1 = get1.getType(defs, context2);

    expect(getType1).toBeInstanceOf(OptionalType);
    expect(getType1.options).toBeInstanceOf(TextType);

    const get2 = Exprs.get('length');
    const getType2 = get2.getType(defs, context2);

    expect(getType2).toBeInstanceOf(NumberType);

    const get3 = Exprs.get('item');
    const getType3 = get3.getType(defs, context2);

    expect(getType3).toBeInstanceOf(DateType);

    const get4 = Exprs.get('missing');
    const getType4 = get4.getType(defs, context2);

    expect(getType4).toBeNull();
  });

  it('map', () => 
  {
    const get1 = Exprs.get('map', 0);
    const getType1 = get1.getType(defs, context0);

    expect(getType1).toBeInstanceOf(TextType);

    const get2 = Exprs.get('map', Exprs.op(NumberOps.create, {}));
    const getType2 = get2.getType(defs, context0);

    expect(getType2).toBeInstanceOf(TextType);

    const get3 = Exprs.get('map', 'invalidKey');
    const getType3 = get3.getType(defs, context0);

    expect(getType3).toBeNull();

    const get4 = Exprs.get('map', 0, 1);
    const getType4 = get4.getType(defs, context0);

    expect(getType4).toBeInstanceOf(TextType);
  });

  it('text length', () =>
  {
    const get = Exprs.get('obj', 'txt', 'length');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('text char at constant', () =>
  {
    const get = Exprs.get('obj', 'txt', 0);
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('text char at dynamic', () =>
  {
    const get = Exprs.get('obj', 'txt', Exprs.op(NumberOps.create, {}));
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('text char at one of', () =>
  {
    const get = Exprs.get('obj', 'txt', 
      Exprs.if(Exprs.const(true))
        .than(Exprs.const(0))
        .else(Exprs.const(1))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('tuple length', () =>
  {
    const get = Exprs.get('tuple', 'length');
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('tuple element at constant', () =>
  {
    const get = Exprs.get('tuple', 1);
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(TextType);
  });

  it('tuple element at dynamic', () =>
  {
    const get = Exprs.get('tuple', Exprs.op(NumberOps.create, {}));
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(ManyType);
    expect(getType.options[0]).toBeInstanceOf(NumberType);
    expect(getType.options[1]).toBeInstanceOf(TextType);
  });

  it('tuple element at one of same', () =>
  {
    const get = Exprs.get('tuple', 
      Exprs.if(Exprs.const(true))
        .than(Exprs.const(0))
        .else(Exprs.const(2))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(NumberType);
  });

  it('tuple element at one of different', () =>
  {
    const get = Exprs.get('tuple', 
      Exprs.if(Exprs.const(true))
        .than(Exprs.const(0))
        .else(Exprs.const(1))
    );
    const getType = get.getType(defs, context0);

    expect(getType).toBeInstanceOf(ManyType);
    expect(getType.options[0]).toBeInstanceOf(NumberType);
    expect(getType.options[1]).toBeInstanceOf(TextType);
  });

})
