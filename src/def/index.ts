
import { Definitions } from '../Definitions';

import { AnyType } from '../types/Any';
import { BooleanType } from '../types/Boolean';
import { ColorType } from '../types/Color';
import { DateType } from '../types/Date';
import { EnumType } from '../types/Enum';
import { FunctionType } from '../types/Function';
import { ListType } from '../types/List';
import { ManyType } from '../types/Many';
import { MapType } from '../types/Map';
import { NullType } from '../types/Null';
import { NumberType } from '../types/Number';
import { ObjectType } from '../types/Object';
import { OptionalType } from '../types/Optional';
import { TextType } from '../types/Text';
import { TupleType } from '../types/Tuple';

import { AndExpression } from '../exprs/And';
import { ChainExpression } from '../exprs/Chain';
import { ConstantExpression } from '../exprs/Constant';
import { DefineExpression } from '../exprs/Define';
import { DoExpression } from '../exprs/Do';
import { ForExpression } from '../exprs/For';
import { GetExpression } from '../exprs/Get';
import { IfExpression } from '../exprs/If';
import { InvokeExpression } from '../exprs/Invoke';
import { NoExpression } from '../exprs/No';
import { NotExpression } from '../exprs/Not';
import { ObjectExpression } from '../exprs/Object';
import { OperationExpression } from '../exprs/Operation';
import { OrExpression } from '../exprs/Or';
import { ReturnExpression } from '../exprs/Return';
import { SetExpression } from '../exprs/Set';
import { SubExpression } from '../exprs/Sub';
import { SwitchExpression } from '../exprs/Switch';
import { TemplateExpression } from '../exprs/Template';
import { TupleExpression } from '../exprs/Tuple';
import { UpdateExpression } from '../exprs/Update';
import { WhileExpression } from '../exprs/While';



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
    TupleType,
    ColorType,
  ],
  expressions: [
    ConstantExpression,
    GetExpression,
    SetExpression,
    SubExpression,
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
    TupleExpression,
    UpdateExpression,
    InvokeExpression,
    ReturnExpression,
    NoExpression,
    ObjectExpression,
  ]
});