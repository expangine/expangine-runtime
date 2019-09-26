// import { describe, it, expect } from 'jest';

import { ExpressionBuilder, defs, DateType, TextType, BooleanType, TextOps, ObjectType, NumberType, ListType, ListOps, NumberOps, MapType } from '../src';


// tslint:disable: no-magic-numbers

describe('Operation', () => {

  const ex = new ExpressionBuilder();
  const context = ObjectType.from({
    num1: NumberType,
    num2: NumberType,
    text1: TextType,
    list1: ListType.forItem(DateType),
    list2: ListType.forItem(ObjectType.from({
      num3: NumberType,
      text2: TextType,
    }))
  });

  it('type constant', () =>
  {
    const op = ex.op(TextOps.create, {});
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(TextType);
  });

  it('type param', () =>
  {
    const op = ex.op(TextOps.isEmpty, {
      value: ex.get('text1')
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(BooleanType);
  });

  it('type same', () =>
  {
    const op = ex.op(ListOps.add, {
      list: ex.get('list1'),
      item: ex.const(new Date())
    });
    const opType = op.getType(defs, context);

    expect(opType).toStrictEqual(context.options.props.list1);
  });

  it('type dynamic', () =>
  {
    const op = ex.op(ListOps.build, {
      item: ex.const(0),
      count: ex.const(34)
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(ListType);
    expect(opType.options.item).toBeInstanceOf(NumberType);
  });

  it('type inferred', () =>
  {
    const op = ex.op(ListOps.map, {
      list: ex.get('list2'),
      transform: ex.get('item', 'text2')
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(ListType);
    expect(opType.options.item).toBeInstanceOf(TextType);
  });

  it('type inferred 2', () =>
  {
    const op = ex.op(ListOps.reduce, {
      list: ex.get('list2'),
      initial: ex.const(0),
      reduce: ex.op(NumberOps.add, {
        value: ex.get('item'),
        addend: ex.get('reduced')
      })
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(NumberType);
  });

  it('type inferred 3', () =>
  {
    const op = ex.op(ListOps.toMap, {
      list: ex.get('list2'),
      getKey: ex.get('item', 'text2')
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(MapType);
    expect(opType.options.key).toBeInstanceOf(TextType);
    expect(opType.options.value).toBeInstanceOf(ObjectType);
  });

  it('type inferred 4', () =>
  {
    const op = ex.op(ListOps.toMap, {
      list: ex.get('list2'),
      getKey: ex.get('item', 'text2'),
      getValue: ex.get('item', 'num3')
    });
    const opType = op.getType(defs, context);

    expect(opType).toBeInstanceOf(MapType);
    expect(opType.options.key).toBeInstanceOf(TextType);
    expect(opType.options.value).toBeInstanceOf(NumberType);
  });

})
