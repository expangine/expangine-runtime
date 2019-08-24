
import { runtime } from '../src/runtimes/js';

// tslint:disable: no-magic-numbers

describe('list', () => {

  it('create', () =>
  {
    const process = runtime.eval(['op', 'list:new', {
      count: ['get', ['n']],
      item: ['get', ['count']]
    }, {
      index: 'lastIndex'
    }]);

    const context = {
      n: 2
    };

    const result = process(context);

    expect(result).toEqual([2, 2]);
  });

  it('create generated', () =>
  {
    const process = runtime.eval(['op', 'list:new', {
      count: ['get', ['n']],
      item: ['op', 'list:new', {
        count: 1,
        item: ['get', ['lastIndex']]
      }]
    }, {
      index: 'lastIndex'
    }]);

    const context = {
      n: 2
    };

    const result = process(context);

    expect(result).toEqual([
      [0], [1]
    ]);
  });

  it('create same', () =>
  {
    const process = runtime.eval(['op', 'list:new', {
      count: ['get', ['n']],
      item: ['op', 'list:new', {
        count: 1,
        item: ['get', ['lastIndex']]
      }],
      sameItem: true
    }, {
      index: 'lastIndex'
    }]);

    const context = {
      n: 2
    };

    const result = process(context);

    expect(result).toEqual([
      [0], [0]
    ]);
    expect(result[0] === result[1]).toBeTruthy();
  });

  it('get', () =>
  {
    const process = runtime.eval(['op', 'list:get', {
      list: ['get', ['list']],
      index: ['get', ['i']]
    }]);

    const list = [1, 2, 3];

    expect(process({ list, i: -1 })).toEqual(undefined);

    expect(process({ list, i: 0 })).toEqual(1);

    expect(process({ list, i: 1 })).toEqual(2);

    expect(process({ list, i: 2 })).toEqual(3);

    expect(process({ list, i: 3 })).toEqual(undefined);
  });

  it('set', () =>
  {
    const process = runtime.eval(['op', 'list:set', {
      list: ['get', ['list']],
      index: ['get', ['i']],
      value: ['get', ['value']]
    }]);

    const list = [1, 2, 3];

    expect(process({ list, i: 0, value: 3 })).toEqual(1);

    expect(process({ list, i: 1, value: 2 })).toEqual(2);

    expect(process({ list, i: 2, value: 1 })).toEqual(3);

    expect(list.length).toEqual(3);

    expect(process({ list, i: 3, value: 0 })).toEqual(undefined);

    expect(list.length).toEqual(4);

    expect(list).toEqual([3, 2, 1, 0]);
  });

  it('add', () =>
  {
    const process = runtime.eval(['op', 'list:+', {
      list: ['get', ['list']],
      item: ['get', ['item']]
    }]);

    const context = {
      list: [1, 2, 3],
      item: 4
    };

    process(context);

    expect(context).toEqual({
      list: [1, 2, 3, 4],
      item: 4
    });
  });

  it('addFirst', () =>
  {
    const process = runtime.eval(['op', 'list:+f', {
      list: ['get', ['list']],
      item: ['get', ['item']]
    }]);

    const context = {
      list: [1, 2, 3],
      item: 4
    };

    process(context);

    expect(context).toEqual({
      list: [4, 1, 2, 3],
      item: 4
    });
  });

  it('addLast', () =>
  {
    const process = runtime.eval(['op', 'list:+l', {
      list: ['get', ['list']],
      item: ['get', ['item']]
    }]);

    const context = {
      list: [1, 2, 3],
      item: 4
    };

    process(context);

    expect(context).toEqual({
      list: [1, 2, 3, 4],
      item: 4
    });
  });

  it('insert', () =>
  {
    const process = runtime.eval(['op', 'list:+@', {
      list: ['get', ['list']],
      item: ['get', ['item']],
      index: ['get', ['at']]
    }]);

    const context = {
      list: [1, 2, 3],
      item: 4,
      at: 1
    };

    process(context);

    expect(context).toEqual({
      list: [1, 4, 2, 3],
      item: 4,
      at: 1
    });
  });

  it('remove', () =>
  {
    const process = runtime.eval(['op', 'list:-', {
      list: ['get', ['source']],
      item: ['get', ['remove']],
      isEqual: ['op', 'num:=', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      source: [1, 2, 3, 4, 5],
      remove: 4
    };

    process(context);

    expect(context).toEqual({
      source: [1, 2, 3, 5],
      remove: 4
    });
  });

  it('removeFirst', () =>
  {
    const process = runtime.eval(['op', 'list:-f', {
      list: ['get', ['source']]
    }]);

    const context = {
      source: [1, 2, 3, 4, 5]
    };

    const result = process(context);

    expect(context).toEqual({
      source: [2, 3, 4, 5]
    });

    expect(result).toEqual(1);
  });

  it('removeLast', () =>
  {
    const process = runtime.eval(['op', 'list:-l', {
      list: ['get', ['source']]
    }]);

    const context = {
      source: [1, 2, 3, 4, 5]
    };

    const result = process(context);

    expect(context).toEqual({
      source: [1, 2, 3, 4]
    });

    expect(result).toEqual(5);
  });

  it('removeAt', () =>
  {
    const process = runtime.eval(['op', 'list:-@', {
      list: ['get', ['source']],
      index: ['get', ['at']]
    }]);

    const context = {
      source: [1, 2, 3, 4, 5],
      at: 2
    };

    const result = process(context);

    expect(context).toEqual({
      source: [1, 2, 4, 5],
      at: 2
    });

    expect(result).toEqual(3);
  });

  it('contains', () =>
  {
    const process = runtime.eval(['op', 'list:contains', {
      list: ['get', ['source']],
      item: ['get', ['check']],
      isEqual: ['op', 'num:=', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      source: [1, 2, 3, 4, 5],
      check: 4
    };

    const result0 = process(context);

    expect(result0).toEqual(true);

    context.check = 6;

    const result1 = process(context);

    expect(result1).toEqual(false);
  });

  it('copy', () =>
  {
    const process = runtime.eval(['op', 'list:copy', {
      list: ['get', ['source']]
    }]);

    const context = {
      source: [1, 2, {a: 3}, 4, 5]
    };

    const result = process(context);

    expect(result).toEqual([1, 2, {a: 3}, 4, 5]);
    expect(result === context.source).toBeFalsy();
    expect(result[2] === context.source[2]).toBeTruthy();
  });

  it('copy deep', () =>
  {
    // if value to copy is number, just get number
    // otherwise replace with null
    const process = runtime.eval(['op', 'list:copy', {
      list: ['get', ['source']],
      deepCopy: ['op', 'any:copy', { value: ['get', ['copy']] }]
    }]);

    const context = {
      source: [1, 2, {a: 3}, 4, 5]
    };

    const result = process(context);

    expect(result).toEqual([1, 2, {a: 3}, 4, 5]);
    expect(result === context.source).toBeFalsy();
    expect(result[2] === context.source[2]).toBeFalsy();
  });

  it('reverse', () =>
  {
    const process = runtime.eval(['op', 'list:reverse', {
      list: ['get', ['source']]
    }]);

    const context = {
      source: [1, 2, 3, 4, 5]
    };

    const result = process(context);

    expect(result).toEqual([5, 4, 3, 2, 1]);
  });

  it('exclude', () =>
  {
    const process = runtime.eval(['op', 'list:exclude', {
      list: ['get', ['source']],
      exclude: ['get', ['minus']],
      isEqual: ['op', 'num:=', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      source: [1, 2, 3, 4, 5],
      minus: [2, 5]
    };

    const result = process(context);

    expect(result).toEqual([1, 3, 4]);
  });

  it('overlap', () =>
  {
    const process = runtime.eval(['op', 'list:overlap', {
      list: ['get', ['source']],
      overlap: ['get', ['intersect']],
      isEqual: ['op', 'num:=', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      source: [1, 2, 3, 4, 5],
      intersect: [0, 2, 5, 6]
    };

    const result = process(context);

    expect(result).toEqual([2, 5]);
  });

  it('sort', () =>
  {
    const process = runtime.eval(['op', 'list:sort', {
      list: ['get', ['source']],
      compare: ['op', 'num:cmp', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      source: [1, 4, 3, 7, 5, 0]
    };

    const result = process(context);

    expect(result).toEqual([0, 1, 3, 4, 5, 7]);
  });

  it('shuffle', () =>
  {
    const process = runtime.eval(['op', 'list:shuffle', {
      list: ['get', ['source']],
      times: 4
    }]);

    const context = {
      source: [1, 4, 3, 7, 5, 0]
    };

    const result = process(context);

    expect(result).not.toEqual([1, 4, 3, 7, 5, 0]);
  });

  it('unique', () =>
  {
    const process = runtime.eval(['op', 'list:unique', {
      list: ['get', ['source']],
      isEqual: ['op', 'num:=', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      source: [1, 4, 3, 7, 5, 0, 3, 7, 1]
    };

    const result = process(context);

    expect(result).toEqual([4, 5, 0]);
  });

  it('duplicates', () =>
  {
    const process = runtime.eval(['op', 'list:dupes', {
      list: ['get', ['source']],
      isEqual: ['op', 'num:=', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      source: [1, 4, 3, 7, 5, 0, 3, 7, 1]
    };

    const result = process(context);

    expect(result).toEqual([1, 3, 7, 3, 7, 1]);
  });

  it('duplicates once', () =>
  {
    const process = runtime.eval(['op', 'list:dupes', {
      list: ['get', ['source']],
      once: true,
      isEqual: ['op', 'num:=', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      source: [1, 4, 3, 7, 5, 0, 3, 7, 1]
    };

    const result = process(context);

    expect(result).toEqual([1, 3, 7]);
  });

  it('take', () =>
  {
    const process = runtime.eval(['op', 'list:take', {
      list: ['get', ['source']],
      count: 5
    }]);

    const context = {
      source: [1, 4, 3, 7, 5, 0, 3, 7, 1]
    };

    const result = process(context);

    expect(result).toEqual([1, 4, 3, 7, 5]);
  });

  it('skip', () =>
  {
    const process = runtime.eval(['op', 'list:skip', {
      list: ['get', ['source']],
      count: 5
    }]);

    const context = {
      source: [1, 4, 3, 7, 5, 0, 3, 7, 1]
    };

    const result = process(context);

    expect(result).toEqual([0, 3, 7, 1]);
  });

  it('drop', () =>
  {
    const process = runtime.eval(['op', 'list:drop', {
      list: ['get', ['source']],
      count: 2
    }]);

    const context = {
      source: [1, 4, 3, 7, 5, 0, 3, 7, 1]
    };

    const result = process(context);

    expect(result).toEqual([1, 4, 3, 7, 5, 0, 3]);
  });

  it('append', () =>
  {
    const process = runtime.eval(['op', 'list:append', {
      list: ['get', ['source']],
      append: ['get', ['add']]
    }]);

    const context = {
      source: [3, 4],
      add: [1, 2]
    };

    const result = process(context);

    expect(result).toEqual([3, 4, 1, 2]);
  });

  it('prepend', () =>
  {
    const process = runtime.eval(['op', 'list:prepend', {
      list: ['get', ['source']],
      prepend: ['get', ['add']]
    }]);

    const context = {
      source: [3, 4],
      add: [1, 2]
    };

    const result = process(context);

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('indexOf', () =>
  {
    const process = runtime.eval(['op', 'list:indexOf', {
      list: ['get', ['haystack']],
      item: ['get', ['needle']],
      isEqual: ['op', 'num:=', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      haystack: [0, 1, 2, 3, 0, 1, 2, 3],
      needle: 2
    };

    const result = process(context);

    expect(result).toEqual(2);
  });

  it('indexOf start', () =>
  {
    const process = runtime.eval(['op', 'list:indexOf', {
      list: ['get', ['haystack']],
      item: ['get', ['needle']],
      start: 3,
      isEqual: ['op', 'num:=', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      haystack: [0, 1, 2, 3, 0, 1, 2, 3],
      needle: 2
    };

    const result = process(context);

    expect(result).toEqual(6);
  });

  it('lastIndexOf', () =>
  {
    const process = runtime.eval(['op', 'list:lastIndexOf', {
      list: ['get', ['haystack']],
      item: ['get', ['needle']],
      isEqual: ['op', 'num:=', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      haystack: [0, 1, 2, 3, 0, 1, 2, 3],
      needle: 2
    };

    const result = process(context);

    expect(result).toEqual(6);
  });

  it('lastIndexOf start', () =>
  {
    const process = runtime.eval(['op', 'list:lastIndexOf', {
      list: ['get', ['haystack']],
      item: ['get', ['needle']],
      start: 3,
      isEqual: ['op', 'num:=', {
        value: ['get', ['value']],
        test: ['get', ['test']]
      }]
    }]);

    const context = {
      haystack: [0, 1, 2, 3, 0, 1, 2, 3],
      needle: 2
    };

    const result = process(context);

    expect(result).toEqual(2);
  });

  it('last', () =>
  {
    const process = runtime.eval(['op', 'list:last', {
      list: ['get', ['source']]
    }]);

    const context = {
      source: [0, 1, 2, 3, 0, 1, 2, 3]
    };

    const result = process(context);

    expect(result).toEqual(3);
  });

  it('first', () =>
  {
    const process = runtime.eval(['op', 'list:first', {
      list: ['get', ['source']]
    }]);

    const context = {
      source: [0, 1, 2, 3, 0, 1, 2, 3]
    };

    const result = process(context);

    expect(result).toEqual(0);
  });

  it('count', () =>
  {
    const process = runtime.eval(['op', 'list:count', {
      list: ['get', ['source']]
    }]);

    const context = {
      source: [0, 1, 2, 3, 0, 1, 2, 3]
    };

    const result = process(context);

    expect(result).toEqual(8);
  });

  it('randomList', () =>
  {
    const process = runtime.eval(['op', 'list:randomList', {
      list: ['get', ['source']],
      count: 2
    }]);

    const context = {
      source: [0, 1, 2, 3, 0, 1, 2, 3]
    };

    const result = process(context);

    expect(result.length).toEqual(2);
  });

  it('join', () =>
  {
    const process = runtime.eval(['op', 'list:join', {
      list: ['get', ['source']]
    }]);

    const context = {
      source: [0, 1, 2, 3]
    };

    const result = process(context);

    expect(result).toEqual('0, 1, 2, 3');
  });

  it('each', () =>
  {
    const process = runtime.eval(['op', 'list:each', {
      list: ['get', ['source']],
      each: ['op', 'list:+', {
        list: ['get', ['target']],
        item: ['get', ['item']]
      }]
    }]);

    const context = {
      source: [1, 4, 5, 6],
      target: [] as number[]
    };

    process(context);

    expect(context.target).toEqual(context.source);
  });

  it('filter', () =>
  {
    const process = runtime.eval(['op', 'list:filter', {
      list: ['get', ['source']],
      filter: ['op', 'num:%?', {
        value: ['get', ['item']],
        by: 2
      }]
    }]);

    const context = {
      source: [0, 1, 2, 3, 4, 5, 6]
    };

    const result = process(context);

    expect(result).toEqual([0, 2, 4, 6]);
    expect(context.source).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('not', () =>
  {
    const process = runtime.eval(['op', 'list:not', {
      list: ['get', ['source']],
      not: ['op', 'num:%?', {
        value: ['get', ['item']],
        by: 2
      }]
    }]);

    const context = {
      source: [0, 1, 2, 3, 4, 5, 6]
    };

    const result = process(context);

    expect(result).toEqual([1, 3, 5]);
    expect(context.source).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('map', () =>
  {
    const process = runtime.eval(['op', 'list:map', {
      list: ['get', ['source']],
      transform: ['op', 'num:*', {
        value: ['get', ['item']],
        multiplier: 2
      }]
    }]);

    const context = {
      source: [0, 1, 2, 3]
    };

    const result = process(context);

    expect(result).toEqual([0, 2, 4, 6]);
    expect(context.source).toEqual([0, 1, 2, 3]);
  });

  it('split', () =>
  {
    const process = runtime.eval(['op', 'list:split', {
      list: ['get', ['source']],
      pass: ['op', 'num:%?', {
        value: ['get', ['item']],
        by: 2
      }]
    }]);

    const context = {
      source: [0, 1, 2, 3, 4, 5, 6]
    };

    const result = process(context);

    expect(result).toEqual({
      pass: [0, 2, 4, 6],
      fail: [1, 3, 5]
    });
  });

  it('reduce', () =>
  {
    const process = runtime.eval(['op', 'list:reduce', {
      list: ['get', ['source']],
      initial: 0,
      reduce: ['op', 'num:+', {
        value: ['get', ['item']],
        addend: ['get', ['reduced']]
      }]
    }]);

    const context = {
      source: [0, 1, 2, 3, 4, 5, 6]
    };

    const result = process(context);

    expect(result).toEqual(21);
  });

  it('group', () => 
  {
    const process = runtime.eval(['op', 'map:plain', {
      map: ['op', 'list:group', {
        list: ['get', ['source']],
        getKey: ['op', 'num:%', {
          value: ['get', ['item']],
          divisor: 3
        }]
      }]
    }]);

    const context = {
      source: [0, 1, 2, 3, 4, 5, 6, 7]
    };

    const result = process(context);

    expect(result).toEqual({
      0: [0, 3, 6],
      1: [1, 4, 7],
      2: [2, 5]
    });
  });

});