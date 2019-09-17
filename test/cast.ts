
import { runtime } from '../src/runtimes/js';
import { TupleType, ObjectType, TextType, BooleanType, DateType, ListType, MapType, NumberType, ConstantExpression } from '../src';

// tslint:disable: no-magic-numbers

describe('cast', () => {

  it('simple', () =>
  {
    const d = new Date();
    const _Date = Date;
    (global as any).Date = jest.fn(() => d);
    global.Date.UTC = _Date.UTC;
    global.Date.parse = _Date.parse;
    global.Date.now = _Date.now;

    const simple: Record<string, Record<string, Array<[any, any]>>> = {
      [BooleanType.id]: {
        [BooleanType.id]: [[true, true], [false, false]],
        [DateType.id]: [[true, d]],
        [ListType.id]: [[true, [true]], [false, [false]]],
        [MapType.id]: [[true, new Map([['value', true]])], [false, new Map([['value', false]])]],
        [NumberType.id]: [[true, 1], [false, 0 ]],
        [ObjectType.id]: [[true, {value: true}], [false, {value: false}]],
        [TextType.id]: [[true, 'true'], [false, 'false']],
        [TupleType.id] : [[true, [true]], [false, [false]]],
      },
      [DateType.id]: {
        [DateType.id]: [[d, d]],
        [ListType.id]: [[d, [d]]],
        [MapType.id]: [[d, new Map([['value', d]])]],
        [NumberType.id]: [[d, d.getTime()]],
        [ObjectType.id]: [[d, {value: d}]],
        [TextType.id]: [[d, d + '']],
        [TupleType.id]: [[d, [d]]],
      },
      [ListType.id]: {
        [ListType.id]: [[ [1, 2], [1, 2]]],
        [MapType.id]: [[ [], new Map() ], [ [3, 4, 5], new Map([['0', 3], ['1', 4], ['2', 5]]) ]],
        [NumberType.id]: [[ [0], 0 ], [ [2], 2 ]],
        [ObjectType.id]: [[ [1, 2, 3], {value: [1, 2, 3]}]],
        [TextType.id]: [[ ['a'], 'a' ], [ [''], '' ]],
        [TupleType.id]: [[ [], [[]] ], [ [1, 2], [[1, 2]] ]],
      },
      [MapType.id]: {
        [MapType.id]: [[ new Map([['x', 1]]), new Map([['x', 1]]) ]],
        [NumberType.id]: [[ new Map([['value', 23]]), 23 ]],
        [ObjectType.id]: [[ new Map([['value', {a: 5}]]), {a: 5}]],
        [TextType.id]: [[ new Map([['value', 'ew']]), 'ew']],
        [TupleType.id]: [[ new Map([['a', 2]]), [new Map([['a', 2]])]]],
      },
      [NumberType.id]: {
        [NumberType.id]: [[ 23, 23 ]],
        [ObjectType.id]: [[ 23, { value: 23 } ]],
        [TextType.id]: [[ 23, '23' ]],
        [TupleType.id]: [[ 23, [23] ]],
      },
      [ObjectType.id]: {
        [ObjectType.id]: [[ {a: 'a'}, {a: 'a'}]],
        [TextType.id]: [[ {value: 'hi'}, 'hi' ]],
        [TupleType.id]: [[ {a: 'a'}, [{a: 'a'}]]],
      },
      [TextType.id]: {
        [TextType.id]: [['ho', 'ho']],
        [TupleType.id]: [['hi', ['hi']]],
      },
      [TupleType.id]: {
        [TupleType.id]: [[ [1, 'a', true], [1, 'a', true] ]],
      },
    }

    for (const a in simple)
    {
      for (const b in simple[a])
      {
        const tests = simple[a][b];
        const opX = `${a}:~${b}`;
        const opY = `${b}:~${a}`;

        for (const [x, y] of tests)
        {
          const toY = runtime.eval(['op', opX, { value: new ConstantExpression(x) }]);
          const msgY = `${a} to ${b} with starting value ${x} and expected ${y}`;

          expect({ msg: msgY, result: toY({}) }).toEqual({ msg: msgY, result: y });

          const toX = runtime.eval(['op', opY, { value: new ConstantExpression(y) }]);
          const msgX = `${b} to ${a} with starting value ${y} and expected ${x}`;

          expect({ msg: msgX, result: toX({}) }).toEqual({ msg: msgX, result: x });
        }
      }
    }

    global.Date = _Date;
  });

});