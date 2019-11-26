
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
import { NotType } from '../types/Not';
import { NullType } from '../types/Null';
import { NumberType } from '../types/Number';
import { ObjectType } from '../types/Object';
import { OptionalType } from '../types/Optional';
import { TextType } from '../types/Text';
import { TupleType } from '../types/Tuple';

import { AndExpression } from '../exprs/And';
import { ChainExpression } from '../exprs/Chain';
import { ComputedExpression } from '../exprs/Computed';
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
    AnyType,
    BooleanType, 
    ColorType,
    DateType,
    EnumType,
    FunctionType,
    ListType, 
    ManyType,
    MapType,
    NotType,
    NullType,
    NumberType, 
    ObjectType, 
    OptionalType,
    TextType,
    TupleType,
  ],
  expressions: [
    AndExpression,
    ChainExpression,
    ComputedExpression,
    ConstantExpression,
    DefineExpression,
    DoExpression,
    ForExpression,
    GetExpression,
    IfExpression,
    InvokeExpression,
    NoExpression,
    NotExpression,
    ObjectExpression,
    OperationExpression,
    OrExpression,
    ReturnExpression,
    SetExpression,
    SubExpression,    
    SwitchExpression,
    TemplateExpression,
    TupleExpression,
    UpdateExpression,
    WhileExpression,
  ]
});