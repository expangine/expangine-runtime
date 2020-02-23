import { Types } from '../../src/Types';
import { Exprs } from '../../src/Exprs';
import { ObjectType } from '../../src/types/Object';
import { defs } from '../../src/def';
import { NumberType } from '../../src/types/Number';
import { TextType } from '../../src/types/Text';

// tslint:disable: no-magic-numbers

describe('Sub', () => {

  const context0 = Types.object({
    num: Types.number(),
    num2: Types.number(),
    list: Types.list(Types.date()),
    obj: Types.object({
      txt: Types.text()
    }),
    obj2: Types.object({
      txt: Types.text(),
      num: Types.number(),
    }),
    enum: Types.enum(
      Types.object({
        enumSub: Types.bool()
      })
    ),
    map: Types.map(Types.text(), Types.number()),
    tuple: Types.tuple(
      Types.number(),
      Types.text(),
      Types.number(),
    ),
  })

  it('root', () =>
  {
    const sub = Exprs.sub(Exprs.get());
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(ObjectType);
  });

  it('object prop', () =>
  {
    const sub = Exprs.sub(Exprs.get('num'));
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(NumberType);
  });

  it('object sub', () =>
  {
    const sub = Exprs.sub(Exprs.get(), 'num');
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(NumberType);
  });

  it('object prop prop', () =>
  {
    const sub = Exprs.sub(Exprs.get('obj', 'txt'));
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(TextType);
  });

  it('object sub sub', () =>
  {
    const sub = Exprs.sub(Exprs.get(), 'obj', 'txt');
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(TextType);
  });

  it('object prop sub', () =>
  {
    const sub = Exprs.sub(Exprs.get('obj'), 'txt');
    const subType = sub.getType(defs, context0);

    expect(subType).toBeInstanceOf(TextType);
  });


})
