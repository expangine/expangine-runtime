import { Types, AnyOpsTypes, isOperationTypeFunction, Type, defs, NumberType, NullType, ManyType, TextType } from '../src';


// tslint:disable: no-magic-numbers

describe('AnyOps', () => {

  it('coalesce', () =>
  {
    const coalesce = AnyOpsTypes.coalesce;
    const getReturnType = isOperationTypeFunction(coalesce.returnType)
      ? coalesce.returnType
      : (): Type => { throw new Error('Why?') };

    const r0 = Types.parse(getReturnType({
      a: Types.optional(Types.number()),
      b: Types.number(),
    }, defs));

    expect(r0).toBeInstanceOf(NumberType);

    const r1 = Types.parse(getReturnType({}, defs));

    expect(r1).toBeInstanceOf(NullType);

    const r2 = Types.parse(getReturnType({
      a: Types.number(),
    }, defs));

    expect(r2).toBeInstanceOf(NumberType);

    const r3 = Types.parse(getReturnType({
      a: Types.number(),
      b: Types.number(),
    }, defs));

    expect(r3).toBeInstanceOf(NumberType);

    const r4 = Types.parse(getReturnType({
      a: Types.number(),
      b: Types.text(),
    }, defs));

    expect(r4).toBeInstanceOf(NumberType);

    const r5 = Types.parse(getReturnType({
      a: Types.optional(Types.number()),
      b: Types.text(),
    }, defs));

    expect(r5).toBeInstanceOf(ManyType);
    expect(r5.options[0]).toBeInstanceOf(NumberType);
    expect(r5.options[1]).toBeInstanceOf(TextType);
  });

})
