import { Types, Exprs, TextOps, defs, TextType, BooleanType, ListOps, ListType, NumberType, NumberOps, MapType, ObjectType } from '../../src';


// tslint:disable: no-magic-numbers

describe('Operation', () => {

  const context = Types.object({
    num1: Types.number(),
    num2: Types.number(),
    text1: Types.text(),
    list1: Types.list(Types.date()),
    list2: Types.list(Types.object({
      num3: Types.number(),
      text2: Types.text(),
    }))
  });

  it('type constant', () =>
  {
    const op = Exprs.op(TextOps.create, {});
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(TextType);
  });

  it('type param', () =>
  {
    const op = Exprs.op(TextOps.isEmpty, {
      value: Exprs.get('text1')
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(BooleanType);
  });

  it('type same', () =>
  {
    const op = Exprs.op(ListOps.add, {
      list: Exprs.get('list1'),
      item: Exprs.const(new Date())
    });
    const opType = op.getType(defs, context);

    expect(opType).toStrictEqual(context.options.props.list1);
  });

  it('type dynamic', () =>
  {
    const op = Exprs.op(ListOps.build, {
      item: Exprs.const(0),
      count: Exprs.const(34)
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(ListType);
    expect(opType?.options.item).toBeInstanceOf(NumberType);
  });

  it('type inferred', () =>
  {
    const op = Exprs.op(ListOps.map, {
      list: Exprs.get('list2'),
      transform: Exprs.get('item', 'text2')
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(ListType);
    expect(opType?.options.item).toBeInstanceOf(TextType);
  });

  it('type inferred 2', () =>
  {
    const op = Exprs.op(ListOps.reduce, {
      list: Exprs.get('list2'),
      initial: Exprs.const(0),
      reduce: Exprs.op(NumberOps.add, {
        value: Exprs.get('item'),
        addend: Exprs.get('reduced')
      })
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(NumberType);
  });

  it('type inferred 3', () =>
  {
    const op = Exprs.op(ListOps.toMap, {
      list: Exprs.get('list2'),
      getKey: Exprs.get('item', 'text2')
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(MapType);
    expect(opType?.options.key).toBeInstanceOf(TextType);
    expect(opType?.options.value).toBeInstanceOf(ObjectType);
  });

  it('type inferred 4', () =>
  {
    const op = Exprs.op(ListOps.toMap, {
      list: Exprs.get('list2'),
      getKey: Exprs.get('item', 'text2'),
      getValue: Exprs.get('item', 'num3')
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(MapType);
    expect(opType?.options.key).toBeInstanceOf(TextType);
    expect(opType?.options.value).toBeInstanceOf(NumberType);
  });

})
