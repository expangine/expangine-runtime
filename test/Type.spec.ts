import { Types } from '../src';


describe('Type', () => 
{

  // tslint:disable: no-magic-numbers

  /**
   * n:Optional One of [
   *   m:Set of l:Map of k:Text => j:Number
   *   i:List of h:Object {
   *     g: g:Integer
   *     d: d:Date
   *     e: e:Enum of Text => a:Any
   *     f: f:Tuple of [ b:Boolean, c:Color ]
   *   }
   * ]
   */
  function getTestTypes()
  {
    const a = Types.any();
    const b = Types.bool();
    const c = Types.color();
    const d = Types.date();
    const e = Types.enum(a);
    const f = Types.tuple(b, c);
    const g = Types.int();
    const h = Types.object({ g, d, e, f });
    const i = Types.list(h);
    const j = Types.number();
    const k = Types.text();
    const l = Types.map(j, k);
    const m = Types.set(l);
    const n = Types.optional(Types.many(m, i));

    return { a, b, c, d, e, f, g, h, i, j, k, l, m, n };
  }

  /*
  function getTestData0()
  {
    return new Set([
      new Map([
        ['a', 1],
        
        ['b', 2],
        ['c', 3],
      ]),
      new Map([
        ['d', 4],
        ['e', 5],
      ]),
      new Map([
        ['f', 6],
      ]),
      new Map([]),
    ]);
  }

  function getTestData1()
  {
    return [
      { 
        g: 1, 
        d: new Date(), 
        e: 45, 
        f: [true, {r: 0, g: 255, b: 127}]
      },
      { 
        g: 2, 
        d: new Date(), 
        e: false, 
        f: [false, {r: 255, g: 0, b: 127}]
      },
      { 
        g: 2, 
        d: new Date(), 
        e: 'meow', 
        f: [false, {r: 255, g: 0, b: 0}]
      },
    ];
  }
  */
  
  it('getRootType', () =>
  {
    const { a, b, c, d, e, f, g, h, i, j, k, l, m, n } = getTestTypes();

    /**
     * n:Optional One of [
     *   m:Set of l:Map of k:Text => j:Number
     *   i:List of h:Object {
     *     g: g:Integer
     *     d: d:Date
     *     e: e:Enum of Text => a:Any
     *     f: f:Tuple of [ b:Boolean, c:Color ]
     *   }
     * ]
     */
    expect(a.getRootType()).toStrictEqual(n);
    expect(b.getRootType()).toStrictEqual(n);
    expect(c.getRootType()).toStrictEqual(n);
    expect(d.getRootType()).toStrictEqual(n);
    expect(e.getRootType()).toStrictEqual(n);
    expect(f.getRootType()).toStrictEqual(n);
    expect(g.getRootType()).toStrictEqual(n);
    expect(h.getRootType()).toStrictEqual(n);
    expect(i.getRootType()).toStrictEqual(n);
    expect(j.getRootType()).toStrictEqual(n);
    expect(k.getRootType()).toStrictEqual(n);
    expect(l.getRootType()).toStrictEqual(n);
    expect(m.getRootType()).toStrictEqual(n);
    expect(n.getRootType()).toStrictEqual(n);
  });

  it('getPath', () =>
  {
    const { a, b, c, d, e, f, g, h, i, j, k, l, m, n } = getTestTypes();

    /**
     * n:Optional One of [
     *   m:Set of l:Map of k:Text => j:Number
     *   i:List of h:Object {
     *     g: g:Integer
     *     d: d:Date
     *     e: e:Enum of Text => a:Any
     *     f: f:Tuple of [ b:Boolean, c:Color ]
     *   }
     * ]
     */
    expect(a.getPath()).toEqual(['optional', 1, 'item', 'e', 'value']);
    expect(b.getPath()).toEqual(['optional', 1, 'item', 'f', 0]);
    expect(c.getPath()).toEqual(['optional', 1, 'item', 'f', 1]);
    expect(d.getPath()).toEqual(['optional', 1, 'item', 'd']);
    expect(e.getPath()).toEqual(['optional', 1, 'item', 'e']);
    expect(f.getPath()).toEqual(['optional', 1, 'item', 'f']);
    expect(g.getPath()).toEqual(['optional', 1, 'item', 'g']);
    expect(h.getPath()).toEqual(['optional', 1, 'item']);
    expect(i.getPath()).toEqual(['optional', 1]);
    expect(j.getPath()).toEqual(['optional', 0, 'value', 'value']);
    expect(k.getPath()).toEqual(['optional', 0, 'value', 'key']);
    expect(l.getPath()).toEqual(['optional', 0, 'value']);
    expect(m.getPath()).toEqual(['optional', 0]);
    expect(n.getPath()).toEqual([]);
  });

  it('getTypeFromPath', () =>
  {
    const { a, b, c, d, e, f, g, h, i, j, k, l, m, n } = getTestTypes();

    /**
     * n:Optional One of [
     *   m:Set of l:Map of k:Text => j:Number
     *   i:List of h:Object {
     *     g: g:Integer
     *     d: d:Date
     *     e: e:Enum of Text => a:Any
     *     f: f:Tuple of [ b:Boolean, c:Color ]
     *   }
     * ]
     */
    expect(n.getTypeFromPath(['optional', 1, 'item', 'e', 'value'])).toStrictEqual(a);
    expect(n.getTypeFromPath(['optional', 1, 'item', 'f', 0])).toStrictEqual(b);
    expect(n.getTypeFromPath(['optional', 1, 'item', 'f', 1])).toStrictEqual(c);
    expect(n.getTypeFromPath(['optional', 1, 'item', 'd'])).toStrictEqual(d);
    expect(n.getTypeFromPath(['optional', 1, 'item', 'e'])).toStrictEqual(e);
    expect(n.getTypeFromPath(['optional', 1, 'item', 'f'])).toStrictEqual(f);
    expect(n.getTypeFromPath(['optional', 1, 'item', 'g'])).toStrictEqual(g);
    expect(n.getTypeFromPath(['optional', 1, 'item'])).toStrictEqual(h);
    expect(n.getTypeFromPath(['optional', 1])).toStrictEqual(i);
    expect(n.getTypeFromPath(['optional', 0, 'value', 'value'])).toStrictEqual(j);
    expect(n.getTypeFromPath(['optional', 0, 'value', 'key'])).toStrictEqual(k);
    expect(n.getTypeFromPath(['optional', 0, 'value'])).toStrictEqual(l);
    expect(n.getTypeFromPath(['optional', 0])).toStrictEqual(m);
    expect(n.getTypeFromPath([])).toStrictEqual(n);
  });

});