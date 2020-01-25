// import { describe, it, expect } from 'jest';
import { inspect } from 'util';
import { defs, TypeBuilder, ExpressionBuilder, Relation, Types } from '../src';


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

      if (!types) 
      {
        console.log(`types missing for ${op.id}`);
        
        expect(types).toBeDefined();
      }
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

  it('has relations', () =>
  {
    defs.addAlias('post', tp.object({
      title: tp.text(),
      content: tp.text(),
      brief: tp.text(),
      created: tp.date(),
    }));

    defs.addAlias('comment', tp.object({
      content: tp.text(),
      created: tp.date(),
    }));

    defs.addAlias('user', tp.object({
      name: tp.text(),
    }))

    defs.addStorage({
      name: 'post'
    });

    defs.addStorage({
      name: 'comment',
    });

    defs.addStorage({
      name: 'user'
    });

    defs.addRelation(Relation.hasMany(defs, {
      one: 'post',
      many: 'comment',
    }));

    defs.addRelation(Relation.hasMany(defs, {
      one: 'user',
      many: 'post',
      oneRelationName: 'posts',
      manyRelationName: 'creator',
      owns: false,
    }));

    defs.addRelation(Relation.hasMany(defs, {
      one: 'user',
      many: 'comment',
      oneRelationName: 'comments',
      manyRelationName: 'creator',
    }));

    defs.addRelation(Relation.hasMany(defs, {
      one: 'comment',
      many: 'comment',
      oneRelationName: 'children',
      manyRelationName: 'parent',
    }));

    defs.addRelation(Relation.hasOnePolymorphic(defs, {
      hasOne: 'comment',
      poly: ['comment', 'post'],
      morphs: ['poly_type_id', Types.text()],
      morphsToRelated: {
        1: 'comment',
        2: 'post'
      },
      hasOneRelationName: 'poly_parent',
      polyRelationName: 'poly_child',
      required: true,
    }));

    const commentRelations = defs.getRelations('comment');
    const commentProps = defs.getTypeProps('comment');

    console.log(inspect(commentRelations, { showHidden: false, depth: 4 }));
    console.log(inspect(commentProps, { showHidden: false, depth: 4 }));
  });

})
