// import { describe, it, expect } from 'jest';

import { defs, TypeBuilder, ExpressionBuilder } from '../src';


// tslint:disable: no-magic-numbers

describe('Definitions', () => {

  const ex = new ExpressionBuilder();
  const tp = new TypeBuilder();


  it('has all types', () =>
  {
    const ops = defs.getOperations();

    expect(ops.length).toBeGreaterThan(0);

    ops.forEach(({ op, types }) => 
    {
      expect(op).toBeDefined();
      expect(types).toBeDefined();
    });
  });

  it('get ops from type', () =>
  {
    const ops = defs.getOperationsForType(tp.tuple());

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with first tuple param', JSON.stringify(ops.map(o => o.op.id)));
  });

  it('get ops from expression', () =>
  {
    const ops = defs.getOperationsForExpression(
      ex.if(ex.true())
        .than(ex.const(0))
        .else(ex.get('x')),
      tp.object({
        x: tp.number()
      })
    );

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with first number param', JSON.stringify(ops.map(o => o.op.id)));
  });

  it('get ops from return type', () =>
  {
    const ops = defs.getOperationsWithReturnType(tp.tuple());

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with tuple return type', JSON.stringify(ops.map(o => o.op.id)));
  });

  it('get ops from return expression', () =>
  {
    const ops = defs.getOperationsWithReturnExpression(
      ex.if(ex.true())
        .than(ex.const(0))
        .else(ex.get('x')),
      tp.object({
        x: tp.number()
      })
    );

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with number return type', JSON.stringify(ops.map(o => o.op.id)));
  });

  it('get ops for param types', () =>
  {
    const ops = defs.getOperationsForParamTypes({
      value: tp.number(),
      test: tp.number()
    });

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with param types { value: number, test: number }', JSON.stringify(ops.map(o => o.op.id)));
  });

  it('get ops for param expressions', () =>
  {
    const ops = defs.getOperationsForParamExpressions({
      value: ex.const(0),
      test: ex.get('x')
    }, tp.object({
      x: tp.number()
    }));

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with param expressions { value: 0, test: context.x }', JSON.stringify(ops.map(o => o.op.id)));
  });

})
