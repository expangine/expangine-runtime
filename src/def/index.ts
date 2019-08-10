
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
import { MapType } from '../types/Map';

import { ConstantExpression } from '../exprs/Constant';
import { GetExpression } from '../exprs/Get';
import { OperationExpression } from '../exprs/Operation';
import { ChainExpression } from '../exprs/Chain';
import { IfExpression } from '../exprs/If';
import { SwitchExpression } from '../exprs/Switch';
import { AndExpression } from '../exprs/And';
import { OrExpression } from '../exprs/Or';
import { NotExpression } from '../exprs/Not';
import { ForExpression } from '../exprs/For';
import { WhileExpression } from '../exprs/While';
import { DoExpression } from '../exprs/Do';
import { DefineExpression } from '../exprs/Define';
import { SetExpression } from '../exprs/Set';
import { TemplateExpression } from '../exprs/Template';
import { UpdateExpression } from '../exprs/Update';
import { EnumType } from '../types/Enum';
import { DateType } from '../types/Date';
import { NullType } from '../types/Null';


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
    MapType,
    EnumType,
    DateType,
    NullType,
  ],
  expressions: [
    ConstantExpression,
    GetExpression,
    SetExpression,
    OperationExpression,
    ChainExpression,
    IfExpression,
    SwitchExpression,
    NotExpression,
    AndExpression,
    OrExpression,
    ForExpression,
    WhileExpression,
    DoExpression,
    DefineExpression,
    TemplateExpression,
    UpdateExpression,
  ]
});