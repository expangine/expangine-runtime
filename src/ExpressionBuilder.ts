import { Expression } from './Expression'
import { isArray, isFunction } from './fns';



/**
 * 
 * e.if(condition).then(value).elseif(condition).then(value).else(value)
 * e.switch(x).case(x).case(x).then(x).otherwise(x)
 * e.op(op,values,scopeAlias)
 * e.and(x).and(y).and(z)
 * e.or(x).or(y).or(z)
 * e.chain()
 * e.constant()
 * e.define({})
 * 
 */
export class ExpressionBuilder
{

  public normalize(input: ExpressionBuilderInput): Expression[]
  {
    if (isFunction(input))
    {
      input = input(new ExpressionBuilder());
    }

    return isArray(input) ? input : [input];
  }

}

export type ExpressionBuilderInput<E = Expression> = 
  E | 
  E[] | 
  ((sub: ExpressionBuilder) => E) |
  ((sub: ExpressionBuilder) => E[]);