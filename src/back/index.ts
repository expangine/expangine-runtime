import { Definitions } from '../Definitions';
import { FlowExpression, FlowType } from '../exprs/Flow';
import { SetExpression } from '../exprs/Set';


export function addBackwardsCompatibility(def: Definitions)
{
  const RETURN_ID = 'return';
  const UPDATE_ID = 'up';
  const UPDATE_CURRENT = 'current';

  const i0 = 0;
  const i1 = 1;
  const i2 = 2;

  def.expressionParsers[RETURN_ID] = (data, exprs) => FlowExpression.decode([data[i0], FlowType.RETURN, data[1]], exprs);
  def.expressionParsers[UPDATE_ID] = (data, exprs) => SetExpression.decode([data[i0], data[i1], data[i2] || UPDATE_CURRENT], exprs);
}