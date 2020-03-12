
import { Definitions } from '../Definitions';

import { EntityType } from '../types/Entity';
import { AnyType } from '../types/Any';
import { BooleanType } from '../types/Boolean';
import { ColorType } from '../types/Color';
import { DateType } from '../types/Date';
import { EnumType } from '../types/Enum';
import { ListType } from '../types/List';
import { ManyType } from '../types/Many';
import { MapType } from '../types/Map';
import { NotType } from '../types/Not';
import { NullType } from '../types/Null';
import { NumberType } from '../types/Number';
import { ObjectType } from '../types/Object';
import { OptionalType } from '../types/Optional';
import { ReferenceType } from '../types/Reference';
import { SetType } from '../types/Set';
import { TextType } from '../types/Text';
import { TupleType } from '../types/Tuple';

import { AndExpression } from '../exprs/And';
import { ChainExpression } from '../exprs/Chain';
import { CommentExpression } from '../exprs/Comment';
import { ComputedExpression } from '../exprs/Computed';
import { ConstantExpression } from '../exprs/Constant';
import { DefineExpression } from '../exprs/Define';
import { DoExpression } from '../exprs/Do';
import { ForExpression } from '../exprs/For';
import { GetExpression } from '../exprs/Get';
import { GetDataExpression } from '../exprs/GetData';
import { GetEntityExpression } from '../exprs/GetEntity';
import { GetRelationExpression } from '../exprs/GetRelation';
import { IfExpression } from '../exprs/If';
import { InvokeExpression } from '../exprs/Invoke';
import { MethodExpression } from '../exprs/Method';
import { NoExpression } from '../exprs/No';
import { NotExpression } from '../exprs/Not';
import { ObjectExpression } from '../exprs/Object';
import { OperationExpression } from '../exprs/Operation';
import { OrExpression } from '../exprs/Or';
import { PathExpression } from '../exprs/Path';
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
    EntityType,
    AnyType,
    BooleanType, 
    ColorType,
    DateType,
    EnumType,
    ListType, 
    ManyType,
    MapType,
    NotType,
    NullType,
    NumberType, 
    ObjectType, 
    OptionalType,
    ReferenceType,
    SetType,
    TextType,
    TupleType,
  ],
  expressions: [
    AndExpression,
    ChainExpression,
    CommentExpression,
    ComputedExpression,
    ConstantExpression,
    DefineExpression,
    DoExpression,
    ForExpression,
    GetExpression,
    GetDataExpression,
    GetEntityExpression,
    GetRelationExpression,
    IfExpression,
    InvokeExpression,
    MethodExpression,
    NoExpression,
    NotExpression,
    ObjectExpression,
    OperationExpression,
    OrExpression,
    PathExpression,
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