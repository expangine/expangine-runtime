import { defs, Types, Exprs, Relation } from '../src';

// tslint:disable: no-magic-numbers

describe('Definitions', () => {

  it('has all types', () =>
  {
    const ops = defs.getOperations();

    expect(ops.length).toBeGreaterThan(0);

    ops.forEach(({ op, types }) => 
    {
      expect(op).toBeDefined();

      if (!types) 
      {
        expect({ op: op.id, message: 'Missing types' }).toBeUndefined();
      }
    });
  });

  it('get ops from type', () =>
  {
    const ops = defs.getOperationsForType(Types.tuple());

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with first tuple param', JSON.stringify(ops.map(o => o.op.id)));
  });

  it('get ops from expression', () =>
  {
    const ops = defs.getOperationsForExpression(
      Exprs.if(Exprs.true())
        .than(Exprs.const(0))
        .else(Exprs.get('x')),
      Types.object({
        x: Types.number()
      })
    );

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with first number param', JSON.stringify(ops.map(o => o.op.id)));
  });

  it('get ops from return type', () =>
  {
    const ops = defs.getOperationsWithReturnType(Types.tuple());

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with tuple return type', JSON.stringify(ops.map(o => o.op.id)));
  });

  it('get ops from return expression', () =>
  {
    const ops = defs.getOperationsWithReturnExpression(
      Exprs.if(Exprs.true())
        .than(Exprs.const(0))
        .else(Exprs.get('x')),
      Types.object({
        x: Types.number()
      })
    );

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with number return type', JSON.stringify(ops.map(o => o.op.id)));
  });

  it('get ops for param types', () =>
  {
    const ops = defs.getOperationsForParamTypes({
      value: Types.number(),
      test: Types.number()
    });

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with param types { value: number, test: number }', JSON.stringify(ops.map(o => o.op.id)));
  });

  it('get ops for param expressions', () =>
  {
    const ops = defs.getOperationsForParamExpressions({
      value: Exprs.const(0),
      test: Exprs.get('x')
    }, Types.object({
      x: Types.number()
    }));

    expect(ops.length).toBeGreaterThan(0);

    console.log('ops with param expressions { value: 0, test: context.x }', JSON.stringify(ops.map(o => o.op.id)));
  });

  it('has relations', () =>
  {
    defs.addEntity({
      name: 'post',
      type: Types.object({
        title: Types.text(),
        content: Types.text(),
        brief: Types.text(),
        created: Types.date(),
      }),
    });

    defs.addEntity({
      name: 'comment', 
      type: Types.object({
        content: Types.text(),
        created: Types.date(),
      }),
    });

    defs.addEntity({
      name: 'user', 
      type: Types.object({
        name: Types.text(),
      }),
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
    const commentProps = defs.getEntityProps('comment');

    expect( commentRelations.length ).toBeGreaterThan(0);
    expect( commentProps.length ).toBeGreaterThan(0);

    // console.log(inspect(commentRelations, { showHidden: false, depth: 4 }));
    // console.log(inspect(commentProps, { showHidden: false, depth: 4 }));
  });

})
