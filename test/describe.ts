// import { describe, it, expect } from 'jest';

import { runtime } from '../src/runtimes/js';
import { NumberType, TextType, AnyType, ListType, ManyType, ObjectType, OptionalType, BooleanType } from '../src';
import { NullType } from '../src/types/Null';

// tslint:disable: no-magic-numbers

const defs = runtime.defs;

describe('describe', () => {

  it('number', () =>
  {
    const t = defs.describe(0);

    expect(t).toBeInstanceOf(NumberType);

    expect(t.options).toEqual({
      min: 0,
      max: 0,
      whole: true
    });
  });

  it('text', () => 
  {
    const t = defs.describe('data');

    expect(t).toBeInstanceOf(TextType);

    expect(t.options).toEqual({
      min: 4,
      max: 4,
      requireLower: true,
      requireUpper: false
    });
  });

  it('null', () => 
  {
    const t = defs.describe(null);

    expect(t).toBeInstanceOf(NullType);
  });

  it('undefined', () => 
  {
    const t = defs.describe(undefined);

    expect(t).toBeInstanceOf(AnyType);
  });

  it('list simple', () => 
  {
    const t = defs.describe([
      1, 2, 3
    ]);

    expect(t).toBeInstanceOf(ListType);
    expect(t.options.min).toEqual(3);
    expect(t.options.max).toEqual(3);
    expect(t.options.item).toBeInstanceOf(NumberType);
    expect(t.options.item.options.min).toEqual(1);
    expect(t.options.item.options.max).toEqual(3);
  });

  it('list mixed', () => 
  {
    const t = defs.describe([
      1, 2, 3, 'hello world'
    ]);

    expect(t).toBeInstanceOf(ListType);
    expect(t.options.min).toEqual(4);
    expect(t.options.max).toEqual(4);
    expect(t.options.item).toBeInstanceOf(ManyType);
    expect(t.options.item.options[0]).toBeInstanceOf(NumberType);
    expect(t.options.item.options[1]).toBeInstanceOf(TextType);
  });

  it('list objects', () => 
  {
    const t = defs.describe([
      { a: 1, b: true },
      { a: 2, b: false, c: 'hi' },
      { a: 0, b: 0 }
    ]);

    expect(t).toBeInstanceOf(ListType);
    const item = t.options.item;
    expect(item).toBeInstanceOf(ObjectType);
    const props = item.options.props;
    expect(props.a).toBeInstanceOf(NumberType);
    expect(props.b).toBeInstanceOf(ManyType);
    expect(props.b.options[0]).toBeInstanceOf(BooleanType);
    expect(props.b.options[1]).toBeInstanceOf(NumberType);
    expect(props.c).toBeInstanceOf(OptionalType);
    expect(props.c.options).toBeInstanceOf(TextType);
  });

  it('list odd', () => 
  {
    const t = defs.describe([
      0, { a: 1 }, '2', { b: 3 }, false
    ]);

    expect(t).toBeInstanceOf(ListType);
    const item = t.options.item;
    expect(item).toBeInstanceOf(ManyType);
    const types = item.options;
    expect(types[0]).toBeInstanceOf(NumberType);
    expect(types[1]).toBeInstanceOf(ObjectType);
    expect(types[2]).toBeInstanceOf(TextType);
    expect(types[3]).toBeInstanceOf(BooleanType);
    const props = types[1].options.props;
    expect(props.a).toBeInstanceOf(OptionalType);
    expect(props.a.options).toBeInstanceOf(NumberType);
    expect(props.b).toBeInstanceOf(OptionalType);
    expect(props.b.options).toBeInstanceOf(NumberType);
  });

});