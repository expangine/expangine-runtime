// import { describe, it, expect } from 'jest';

import { Type, TypeBuilder, Traverser, NumberType, BooleanType, ObjectType, ListType, DateType, MapType, TextType, TypeClass, TraverseStep, TraverseResult } from '../src';


// tslint:disable: no-magic-numbers

describe('Traverser', () => {

  const tp = new TypeBuilder();

  it('test all', () =>
  {
    const node = tp.object({
      x: tp.number(),
      y: tp.list(tp.date()),
      z: tp.map(tp.bool(), tp.text()),
    });

    const expected: [TypeClass, TraverseStep[]][] = [
      [ObjectType, []],
      [NumberType, ['x']],
      [ListType, ['y']],
      [DateType, ['y', 'item']],
      [MapType, ['z']],
      [TextType, ['z', 'key']],
      [BooleanType, ['z', 'value']]
    ];

    let index = 0;

    const traverser = new Traverser<Type>((value, stack, path) => {
      const [expectedClass, expectedPath] = expected[index];
      expect(value).toBeInstanceOf(expectedClass);
      expect(path).toEqual(expectedPath);
      index++;
    });

    node.traverse(traverser);

    expect(index).toEqual(expected.length);
  });

  it('test list', () =>
  {
    const node = tp.object({
      x: tp.number(),
      y: tp.list(tp.date()),
      z: tp.map(tp.bool(), tp.text()),
    });

    const o1 = node;
    const n1 = node.options.props.x;
    const l1 = node.options.props.y;
    const d1 = node.options.props.y.options.item;
    const m1 = node.options.props.z;
    const t1 = node.options.props.z.options.value;
    const b1 = node.options.props.z.options.key;

    const expected: TraverseResult<Type>[] = [
      { value: o1, stack: [], path: [] },
      { value: n1, stack: [o1], path: ['x'] },
      { value: l1, stack: [o1], path: ['y'] },
      { value: d1, stack: [o1, l1], path: ['y', 'item'] },
      { value: m1, stack: [o1], path: ['z'] },
      { value: b1, stack: [o1, m1], path: ['z', 'key'] },
      { value: t1, stack: [o1, m1], path: ['z', 'value'] }
    ];

    const actual = node.traverse(Traverser.list());

    expect(actual).toEqual(expected);
  });

  it('test filtered custom', () =>
  {
    const node = tp.object({
      x: tp.number(),
      y: tp.list(tp.date()),
      z: tp.map(tp.bool(), tp.text()),
    });

    const expected: [TypeClass, TraverseStep[]][] = [
      [NumberType, ['x']],
      [ListType, ['y']],
      [MapType, ['z']],
    ];

    let index = 0;

    const traverser = new Traverser<Type>((value, stack, path) => {
      const [expectedClass, expectedPath] = expected[index];
      expect(value).toBeInstanceOf(expectedClass);
      expect(path).toEqual(expectedPath);
      index++;
    });

    node.traverse(traverser.filter((v, s, p) => p.length === 1));

    expect(index).toEqual(expected.length);
  });

  it('test filtered class', () =>
  {
    const node = tp.object({
      x: tp.number(),
      y: tp.list(tp.date()),
      z: tp.map(tp.bool(), tp.text()),
    });

    const expected: [TypeClass, TraverseStep[]][] = [
      [MapType, ['z']],
    ];

    let index = 0;

    const traverser = new Traverser<Type>((value, stack, path) => {
      const [expectedClass, expectedPath] = expected[index];
      expect(value).toBeInstanceOf(expectedClass);
      expect(path).toEqual(expectedPath);
      index++;
    });

    const filtered = traverser.filterClass(MapType);

    node.traverse(filtered);

    expect(index).toEqual(expected.length);
  });

})
