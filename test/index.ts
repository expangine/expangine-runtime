// import { describe, it, expect } from 'jest';

import { runtime } from '../src/runtimes/js';

// tslint:disable: no-magic-numbers

describe('index', () => {

  it('has test', () =>
  {
    const processor = runtime.eval(['op', 'num:+', {
      value: ['var', ['a']],
      addend: ['if', [  
        [['var', ['b']], 2 ] // if b <> 0, 2
      ], 10]
    }])

    const a = processor({
      a: 2,
      b: 3
    }); // 4

    expect(a).toEqual(4);

    const b = processor({
      a: 2,
      b: 0
    }); // 12

    expect(b).toEqual(12);

    /*
    const getEven = runtime.eval(['op', 'list:filter', {
      list: ['var', ['target']],
      filter: ['op', 'num:0?', {a: ['op', 'num:%', {a: ['var', ['item']], b: 2}]}]
    }]);

    expect(getEven({
      target: [1, 2, 3, 4, 5, 6, 7]
    }).toEqual([2, 4, 6]);
    */
  });

})
