
import { Definitions } from '../Definitions';

import { ListType } from '../types/List';
import { BooleanType } from '../types/Boolean';
import { NumberType } from '../types/Number';
import { TextType } from '../types/Text';
import { ObjectType } from '../types/Object';
import { FunctionType } from '../types/Function';
import { AnyType } from '../types/Any';
import { ManyType } from '../types/Many';
import { OptionalType } from '../types/Optional';

import { ConstantExpression } from '../exprs/Constant';
import { VariableExpression } from '../exprs/Variable';
import { OperationExpression } from '../exprs/Operation';
import { ChainExpression } from '../exprs/Chain';
import { CaseExpression } from '../exprs/Case';
import { AndExpression } from '../exprs/And';
import { OrExpression } from '../exprs/Or';
import { NotExpression } from '../exprs/Not';
import { ForExpression } from '../exprs/For';
import { WhileExpression } from '../exprs/While';
import { DefineExpression } from '../exprs/Define';


export const defs = new Definitions({
  types: [
    ListType, 
    NumberType, 
    TextType,
    BooleanType, 
    ObjectType, 
    FunctionType,
    AnyType,
    ManyType,
    OptionalType,
  ],
  expressions: [
    ConstantExpression,
    VariableExpression,
    OperationExpression,
    ChainExpression,
    CaseExpression,
    NotExpression,
    AndExpression,
    OrExpression,
    ForExpression,
    WhileExpression,
    DefineExpression,
  ]
});