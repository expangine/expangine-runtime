import { Exprs, NumberOps, defs, ListOps, Types } from '../src';


describe('Expression', () => 
{

  // tslint:disable: no-magic-numbers

  /**
   * j:If (c:Constant(true)) {
   *   For i = d:Constant(0); i < a:Get{x} {
   *     e:Set y = b:Constant(23) 
   *   }
   * } ElseIf (a:Get{x}) {
   *   return { 
   *     g: g:Hello, 
   *     h: h:Op(abs, { value: b:Constant(23) })
   *   }
   * }
   */
  function getTestExpressions()
  {
    const a = Exprs.get('x');
    const b = Exprs.const(23);
    const c = Exprs.true();
    const d = Exprs.zero();
    const e = Exprs.set('y').to(b);
    const f = Exprs.for('i', d, a, e);
    const g = Exprs.const('Hello');
    const h = Exprs.op(NumberOps.abs, { value: b });
    const i = Exprs.object({ g, h });
    const j = Exprs.if(c, f).elseif(a, i);

    j.setParent();

    return { a, b, c, d, e, f, g, h, i, j };
  }

  it('getRootExpression', () =>
  {
    const { a, b, c, d, e, f, g, h, i, j } = getTestExpressions();

    /**
     * j:If (c:Constant(true)) {
     *   For i = d:Constant(0); i < a:Get{x} {
     *     e:Set y = b:Constant(32) 
     *   }
     * } ElseIf (a:Get{x}) {
     *   return { 
     *     g: g:Hello, 
     *     h: h:Op(abs, { value: b:Constant(23) })
     *   }
     * }
     */
    expect(a.getRootExpression() === j).toBeTruthy();
    expect(b.getRootExpression() === j).toBeTruthy();
    expect(c.getRootExpression() === j).toBeTruthy();
    expect(d.getRootExpression() === j).toBeTruthy();
    expect(e.getRootExpression() === j).toBeTruthy();
    expect(f.getRootExpression() === j).toBeTruthy();
    expect(g.getRootExpression() === j).toBeTruthy();
    expect(h.getRootExpression() === j).toBeTruthy();
    expect(i.getRootExpression() === j).toBeTruthy();
    expect(j.getRootExpression() === j).toBeTruthy();
  });

  it('getPath', () =>
  {
    const { a, b, c, d, e, f, g, h, i, j } = getTestExpressions();

    /**
     * j:If (c:Constant(true)) {
     *   For i = d:Constant(0); i < a:Get{x} {
     *     e:Set y = b:Constant(32) 
     *   }
     * } ElseIf (a:Get{x}) {
     *   return { 
     *     g: g:Hello, 
     *     h: h:Op(abs, { value: b:Constant(23) })
     *   }
     * }
     */

    expect(a.getPath()).toEqual(['cases', 1, 'if']);
    expect(b.getPath()).toEqual(['cases', 1, 'then', 'h', 'value']);
    expect(c.getPath()).toEqual(['cases', 0, 'if']);
    expect(d.getPath()).toEqual(['cases', 0, 'then', 'start']);
    expect(e.getPath()).toEqual(['cases', 0, 'then', 'body']);
    expect(f.getPath()).toEqual(['cases', 0, 'then']);
    expect(g.getPath()).toEqual(['cases', 1, 'then', 'g']);
    expect(h.getPath()).toEqual(['cases', 1, 'then', 'h']);
    expect(i.getPath()).toEqual(['cases', 1, 'then']);
    expect(j.getPath()).toEqual([]);
  });

  it('getExpressionFromPath', () =>
  {
    const { a, b, c, d, e, f, g, h, i, j } = getTestExpressions();

    /**
     * j:If (c:Constant(true)) {
     *   For i = d:Constant(0); i < a:Get{x} {
     *     e:Set y = b:Constant(32) 
     *   }
     * } ElseIf (a:Get{x}) {
     *   return { 
     *     g: g:Hello, 
     *     h: h:Op(abs, { value: b:Constant(23) })
     *   }
     * }
     */

    expect(j.getExpressionFromPath(['cases', 0, 'then', 'end'])).toStrictEqual(a);
    expect(j.getExpressionFromPath(['cases', 1, 'if'])).toStrictEqual(a);
    expect(j.getExpressionFromPath(['cases', 0, 'then', 'body', 'value'])).toStrictEqual(b);
    expect(j.getExpressionFromPath(['cases', 1, 'then', 'h', 'value'])).toStrictEqual(b);
    expect(j.getExpressionFromPath(['cases', 0, 'if'])).toStrictEqual(c);
    expect(j.getExpressionFromPath(['cases', 0, 'then', 'start'])).toStrictEqual(d);
    expect(j.getExpressionFromPath(['cases', 0, 'then', 'body'])).toStrictEqual(e);
    expect(j.getExpressionFromPath(['cases', 0, 'then'])).toStrictEqual(f);
    expect(j.getExpressionFromPath(['cases', 1, 'then', 'g'])).toStrictEqual(g);
    expect(j.getExpressionFromPath(['cases', 1, 'then', 'h'])).toStrictEqual(h);
    expect(j.getExpressionFromPath(['cases', 1, 'then'])).toStrictEqual(i);
    expect(j.getExpressionFromPath([])).toStrictEqual(j);
  });

  it('mutates set sub', () => 
  {
    const e = Exprs.body(
      Exprs.set(Exprs.get('x', 'y')).to(Exprs.const(34))
    );

    expect(e.mutates(defs, 'x')).toBeTruthy();
    expect(e.mutates(defs, 'y')).toBeFalsy();
  });

  it('mutates set directly', () => 
  {
    const e = Exprs.body(
      Exprs.set(Exprs.get('x')).to(Exprs.const(34))
    );

    expect(e.mutates(defs, 'x', true)).toBeTruthy();
    expect(e.mutates(defs, 'x', false)).toBeFalsy();
  });

  it('mutates update sub', () => 
  {
    const e = Exprs.body(
      Exprs.set(Exprs.get('x', 'y')).to(Exprs.const(34))
    );

    expect(e.mutates(defs, 'x')).toBeTruthy();
    expect(e.mutates(defs, 'y')).toBeFalsy();
  });

  it('mutates update directly', () => 
  {
    const e = Exprs.body(
      Exprs.set(Exprs.get('x')).to(Exprs.const(34))
    );

    expect(e.mutates(defs, 'x', true)).toBeTruthy();
    expect(e.mutates(defs, 'x', false)).toBeFalsy();
  });

  it('mutates op', () => 
  {
    const e = Exprs.op(ListOps.add, {
      list: Exprs.get('x'),
      item: Exprs.const(3),
    });

    expect(e.mutates(defs, 'x', true)).toBeTruthy();
    expect(e.mutates(defs, 'x', false)).toBeTruthy();
    expect(e.mutates(defs, 'y', true)).toBeFalsy();
    expect(e.mutates(defs, 'y', false)).toBeFalsy();
  });

  it('mutates op in func', () => 
  {
    const FUNC_NAME = 'mutateOpInFunc';

    const type = Types.func(defs, {
      x: Types.list(Types.number()),
    });

    defs.addFunction({
      name: FUNC_NAME,
      type,
      expression: Exprs.return(
        Exprs.op(ListOps.add, {
          list: Exprs.get('x'),
          item: Exprs.const(3),
        }),
      ),
    });

    const f = defs.getFunction(FUNC_NAME);

    expect(f.mutates(defs, 'x')).toBeTruthy();
    
    const e = Exprs.invoke(FUNC_NAME, {
      x: Exprs.get('y')
    });

    expect(e.mutates(defs, 'y', true)).toBeTruthy();
    expect(e.mutates(defs, 'y', false)).toBeTruthy();
  });

  it('mutate not in func', () => 
  {
    const FUNC_NAME = 'mutateNotInFunc';

    const type = Types.func(defs, {
      x: Types.list(Types.number()),
    });

    defs.addFunction({
      name: FUNC_NAME,
      type,
      expression: Exprs.return(
        Exprs.set(Exprs.get('x')).to(Exprs.const(4)),
      ),
    });

    const f = defs.getFunction(FUNC_NAME);

    expect(f.mutates(defs, 'x')).toBeFalsy();
    
    const e = Exprs.invoke(FUNC_NAME, {
      x: Exprs.get('y')
    });

    expect(e.mutates(defs, 'y', true)).toBeFalsy();
    expect(e.mutates(defs, 'y', false)).toBeFalsy();
  });

});