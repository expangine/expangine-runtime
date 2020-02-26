import { EntityOps, defs, Exprs, Types, EntityType, Relation } from '../../src';


describe('types / Entity', () => {

  defs.clearEntities();
  defs.clearRelations();

  defs.addEntity({
    name: 'Person',
    type: Types.object({
      first: Types.text(),
      last: Types.text(),
    }),
  });

  defs.addRelation(Relation.hasMany(defs, {
    one: 'Person',
    oneRelationName: 'children',
    many: 'Person',
    manyRelationName: 'parent',
    owns: true,
  }));

  it('entity expected type', () =>
  {
    const { name } = defs.getOperationExpectedTypes(EntityOps.get.id, {
      name: Exprs.entity('Person'),
    }, {}, Types.object());

    expect(name).toBeInstanceOf(EntityType);
    expect(name.options).toEqual('Person');
  });

  it('entity return type', () =>
  {
    const returnType = defs.getOperationReturnType(EntityOps.get.id, {
      name: Exprs.entity('Person'),
    }, {}, Types.object());

    expect(returnType.encode()).toEqual(
      Types.list(
        Types.object({
          first: Types.text(),
          last: Types.text(),
        }),
      ).encode(),
    );
  });

  it('relation return type 1', () =>
  {
    const returnType = defs.getOperationReturnType(EntityOps.getRelated.id, {
      name: Exprs.entity('Person'),
      relation: Exprs.relation('parent'),
    }, {}, Types.object());

    expect(returnType.encode()).toEqual(
      Types.object({
        first: Types.text(),
        last: Types.text(),
      }).encode(),
    );
  });

  it('relation return type 2', () =>
  {
    const returnType = defs.getOperationReturnType(EntityOps.getRelated.id, {
      name: Exprs.entity('Person'),
      relation: Exprs.relation('children'),
    }, {}, Types.object());

    expect(returnType.encode()).toEqual(
      Types.list(
        Types.object({
          first: Types.text(),
          last: Types.text(),
        }),
      ).encode(),
    );
  });

});