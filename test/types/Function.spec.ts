import { Type, Types } from '../../src';

describe('types / Function', () => {

  
  it('returns based on template', () =>
  {
    const func = Types.func({
      value: Types.any(),
    }, Types.list(Types.generic(['value'])));

    const params = { value: Types.text() };
    const resolved = func.getOverloaded(params);

    const actual1 = resolved.getReturnType();
    const expected1 = Types.list(Types.text());

    expect(expected1.encode()).toStrictEqual(actual1.encode());
  });

  it('param based on self with default', () =>
  {
    const func = Types.func({
      a: Types.generic(['a'], Types.any()),
      b: Types.generic(['a']),
    }, Types.bool());

    const params = {};
    const resolved = func.getOverloaded(params);

    const actual1 = resolved.options.params.a as Type;
    const expected1 = Types.any();

    expect(expected1.encode()).toStrictEqual(actual1.encode());

    const actual2 = resolved.options.params.b as Type;
    const expected2 = Types.any();

    expect(expected2.encode()).toStrictEqual(actual2.encode());
  });

  it('param based on self', () =>
  {
    const func = Types.func({
      a: Types.generic(['a'], Types.any()),
      b: Types.generic(['a']),
    }, Types.bool());

    const params = { a: Types.text() };
    const resolved = func.getOverloaded(params);

    const actual1 = resolved.options.params.a as Type;
    const expected1 = Types.text();

    expect(expected1.encode()).toStrictEqual(actual1.encode());

    const actual2 = resolved.options.params.b as Type;
    const expected2 = Types.text();

    expect(expected2.encode()).toStrictEqual(actual2.encode());
  });

  it('param outer types default', () =>
  {
    // <V = any, R = any> (list: V[], each: (item: V, index: number) => R) => R[]
    const func = Types.func({
      list: Types.list(Types.generic(['list', 'item'], Types.any())),
      each: Types.func({
        item: Types.generic(['list', 'item']),
        index: Types.number(),
      }, Types.generic(['each', 'returns'], Types.any()))
    }, Types.list(Types.generic(['each', 'returns'])));

    const params = {};
    const resolved = func.getOverloaded(params);

    const actual1 = resolved.options.params.list as Type;
    const expected1 = Types.list(Types.any());

    expect(expected1.encode()).toStrictEqual(actual1.encode());

    const actual2 = resolved.options.params.each as Type;
    const expected2 = Types.func({
      item: Types.any(),
      index: Types.number(),
    }, Types.any());

    expect(expected2.encode()).toStrictEqual(actual2.encode());

    const actual3 = resolved.options.returns as Type;
    const expected3 = Types.list(Types.any());

    expect(expected3.encode()).toStrictEqual(actual3.encode());
  });

  it('param outer types', () =>
  {
    // <V = any, R = any> (list: V[], each: (item: V, index: number) => R) => R[]
    const func = Types.func({
      list: Types.list(Types.generic(['list', 'item'], Types.any())),
      each: Types.func({
        item: Types.generic(['list', 'item']),
        index: Types.number(),
      }, Types.generic(['each'], Types.any()))
    }, Types.list(Types.generic(['each'])));

    const params = { list: Types.list(Types.text()), each: Types.bool() };
    const resolved = func.getOverloaded(params);

    const actual1 = resolved.options.params.list as Type;
    const expected1 = Types.list(Types.text());

    expect(expected1.encode()).toStrictEqual(actual1.encode());

    const actual2 = resolved.options.params.each as Type;
    const expected2 = Types.func({
      item: Types.text(),
      index: Types.number(),
    }, Types.bool());

    expect(expected2.encode()).toStrictEqual(actual2.encode());

    const actual3 = resolved.options.returns as Type;
    const expected3 = Types.list(Types.bool());

    expect(expected3.encode()).toStrictEqual(actual3.encode());
  });

});