import { Definitions } from '../Definitions';
import { Expression } from '../Expression';
import { FlowExpression } from '../exprs/Flow';
import { FlowType } from "../FlowType";
import { PathExpression } from '../exprs/Path';
import { SetExpression } from '../exprs/Set';


export function addBackwardsCompatibility(def: Definitions)
{
  const RETURN_ID = 'return';
  const SUB_ID = 'sub';
  const UPDATE_ID = 'up';
  const UPDATE_CURRENT = 'current';

  const i0 = 0;
  const i1 = 1;
  const i2 = 2;
  const i3 = 3;

  def.expressionParsers[RETURN_ID] = (data, exprs) => {
    exprs.setLegacy();

    return FlowExpression.decode([data[i0], FlowType.RETURN, data[1]], exprs);
  };

  def.expressionParsers[UPDATE_ID] = (data, exprs) => {
    exprs.setLegacy();

    return SetExpression.decode([data[i0], data[i1], data[i2], data[i3] || UPDATE_CURRENT], exprs);
  };

  def.expressionParsers[SUB_ID] = (data, exprs) => {
    const value: Expression = exprs.getExpression(data[i1]);
    const path: Expression[] = data[i2].map((part: any) => exprs.getExpression(part));

    exprs.setLegacy();

    return PathExpression.createForLegacy([value, ...path]);
  };
}