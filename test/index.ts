// import { describe, it, expect } from 'jest';

import { runtime } from '../src/runtimes/js';

// tslint:disable: no-magic-numbers

describe('index', () => {

  it('has test', () =>
  {
    const processor = runtime.eval(['op', 'num:+', {
      value: ['get', ['a']],
      addend: ['if', [  
        [['get', ['b']], 2 ] // if b <> 0, 2
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
  });

  it('do', () => {
    // do { a = a + 1 } while (a < 10)
    const test = runtime.eval(['do',
      ['op', 'num:<', {
        value: ['get', ['a']],
        test: 10
      }],
      ['set', ['a'], ['op', 'num:+', {
        value: ['get', ['a']],
        addend: 1
      }]]
    ]);

    const ctx = { a: 2 };

    test(ctx);

    expect(ctx.a).toEqual(10);
  });

  it('do break', () => {
    // do { a = a + 1; if (a == 4) break; } while (a < 10)
    const test = runtime.eval(['do',
      ['op', 'num:<', {
        value: ['get', ['a']],
        test: 10
      }],
      ['chain', [
        ['set', ['a'], ['op', 'num:+', {
          value: ['get', ['a']],
          addend: 1
        }]],
        ['set', ['break'], ['op', 'num:=', {
          value: ['get', ['a']],
          test: 4
        }]]
      ]]
    ]);

    const ctx = { a: 2 };

    test(ctx);

    expect(ctx.a).toEqual(4);
  });

  it('while', () => {
    // while (a < 10) { a = a + 1; }
    const test = runtime.eval(['while',
      ['op', 'num:<', {
        value: ['get', ['a']],
        test: 10
      }],
      ['set', ['a'], ['op', 'num:+', {
        value: ['get', ['a']],
        addend: 1
      }]]
    ]);

    const ctx = { a: 2 };

    test(ctx);

    expect(ctx.a).toEqual(10);
  });

  it('while break', () => {
    // while (a < 10) { a = a + 1; if (a == 4) break; }
    const test = runtime.eval(['while',
      ['op', 'num:<', {
        value: ['get', ['a']],
        test: 10
      }],
      ['chain', [
        ['set', ['a'], ['op', 'num:+', {
          value: ['get', ['a']],
          addend: 1
        }]],
        ['set', ['break'], ['op', 'num:=', {
          value: ['get', ['a']],
          test: 4
        }]]
      ]]
    ]);

    const ctx = { a: 2 };

    test(ctx);

    expect(ctx.a).toEqual(4);
  });

  it('template', () => {

    const injector = runtime.eval(['tmpl', '/user/{user_id}/post/{post_id}', {
      user_id: ['get', ['user_id']],
      post_id: 12
    }]);

    expect(injector({
      user_id: 24
    })).toEqual('/user/24/post/12');
  });

})
