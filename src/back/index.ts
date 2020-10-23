import { Definitions } from '../Definitions';
import { FlowExpression, FlowType } from '../exprs/Flow';
import { SetExpression } from '../exprs/Set';


export function addBackwardsCompatibility(def: Definitions)
{
  const RETURN_ID = 'return';
  const UPDATE_ID = 'up';

  def.expressionParsers[RETURN_ID] = (data, exprs) => FlowExpression.decode([data[0], FlowType.RETURN, data[1]], exprs);
  def.expressionParsers[UPDATE_ID] = (data, exprs) => SetExpression.decode(data, exprs);
}