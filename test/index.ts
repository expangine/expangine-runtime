// import { describe, it, expect } from 'jest';

import { defs } from '../src';

// tslint:disable: no-magic-numbers

describe('index', () => {

  it('count operations', () =>
  {
    let total = 0;

    defs.typeList.forEach((type) => {
      total += Object.keys(type.operations.map).length;
    });

    console.log('Total # of operations', total);
  });

})
