import { AnyOpsTypes } from '../src/ops/types/AnyOpsTypes';
import { isOperationTypeFunction } from '../src/Operation';
import { Type } from '../src/Type';
import { Types } from '../src/TypeBuilder';
import { defs } from '../src/def';
import { NumberType } from '../src/types/Number';
import { NullType } from '../src/types/Null';
import { ManyType } from '../src/types/Many';
import { TextType } from '../src/types/Text';

// tslint:disable: no-magic-numbers

describe('AnyOps', () => {

  it('coalesce', () =>
  {
    const coalesce = AnyOpsTypes.coalesce;
    const getReturnType = isOperationTypeFunction(coalesce.returnType)
      ? coalesce.returnType
      : (): Type => { throw new Error('Why?') };

    const r0 = Type.fromInput(getReturnType({
      a: Types.optional(Types.number()),
      b: Types.number(),
    }, defs));

    expect(r0).toBeInstanceOf(NumberType);

    const r1 = Type.fromInput(getReturnType({}, defs));

    expect(r1).toBeInstanceOf(NullType);

    const r2 = Type.fromInput(getReturnType({
      a: Types.number(),
    }, defs));

    expect(r2).toBeInstanceOf(NumberType);

    const r3 = Type.fromInput(getReturnType({
      a: Types.number(),
      b: Types.number(),
    }, defs));

    expect(r3).toBeInstanceOf(NumberType);

    const r4 = Type.fromInput(getReturnType({
      a: Types.number(),
      b: Types.text(),
    }, defs));

    expect(r4).toBeInstanceOf(NumberType);

    const r5 = Type.fromInput(getReturnType({
      a: Types.optional(Types.number()),
      b: Types.text(),
    }, defs));

    expect(r5).toBeInstanceOf(ManyType);
    expect(r5.options[0]).toBeInstanceOf(NumberType);
    expect(r5.options[1]).toBeInstanceOf(TextType);
  });

})
