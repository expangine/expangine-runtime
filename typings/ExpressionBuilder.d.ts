import { Expression } from './Expression';
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
export declare class ExpressionBuilder {
    normalize(input: ExpressionBuilderInput): Expression[];
}
export declare type ExpressionBuilderInput<E = Expression> = E | E[] | ((sub: ExpressionBuilder) => E) | ((sub: ExpressionBuilder) => E[]);
