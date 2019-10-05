// import { describe, it, expect } from 'jest';

import { Type, TypeBuilder, NumberType, AnyOpsTypes, isFunction, NullType, ManyType, TextType } from '../src';


// tslint:disable: no-magic-numbers

describe('AnyOps', () => {

  const tp = new TypeBuilder();
  
  it('coalesce', () =>
  {
    const coalesce = AnyOpsTypes.coalesce;
    const getReturnType = isFunction(coalesce.returnType)
      ? coalesce.returnType
      : (): Type => { throw new Error('Why?') };

    const r0 = Type.fromInput(getReturnType({
      a: tp.optional(tp.number()),
      b: tp.number(),
    }));

    expect(r0).toBeInstanceOf(NumberType);

    const r1 = Type.fromInput(getReturnType({}));

    expect(r1).toBeInstanceOf(NullType);

    const r2 = Type.fromInput(getReturnType({
      a: tp.number(),
    }));

    expect(r2).toBeInstanceOf(NumberType);

    const r3 = Type.fromInput(getReturnType({
      a: tp.number(),
      b: tp.number(),
    }));

    expect(r3).toBeInstanceOf(NumberType);

    const r4 = Type.fromInput(getReturnType({
      a: tp.number(),
      b: tp.text(),
    }));

    expect(r4).toBeInstanceOf(NumberType);

    const r5 = Type.fromInput(getReturnType({
      a: tp.optional(tp.number()),
      b: tp.text(),
    }));

    expect(r5).toBeInstanceOf(ManyType);
    expect(r5.options[0]).toBeInstanceOf(NumberType);
    expect(r5.options[1]).toBeInstanceOf(TextType);
  });

})
