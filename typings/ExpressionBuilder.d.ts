import { Expression, ExpressionValue } from './Expression';
import { NotExpression } from './exprs/Not';
import { AndExpression } from './exprs/And';
import { ChainExpression } from './exprs/Chain';
import { DefineExpression } from './exprs/Define';
import { DoExpression } from './exprs/Do';
import { ConstantExpression } from './exprs/Constant';
import { ForExpression } from './exprs/For';
import { GetExpression } from './exprs/Get';
import { IfExpression } from './exprs/If';
import { InvokeExpression } from './exprs/Invoke';
import { OperationExpression } from './exprs/Operation';
import { Operation } from './Operation';
import { OrExpression } from './exprs/Or';
import { ReturnExpression } from './exprs/Return';
import { SetExpression } from './exprs/Set';
import { SwitchExpression } from './exprs/Switch';
import { TemplateExpression } from './exprs/Template';
import { UpdateExpression } from './exprs/Update';
import { WhileExpression } from './exprs/While';
export declare class ExpressionBuilder {
    and(...exprs: Expression[]): AndExpression;
    body(...exprs: Expression[]): ChainExpression;
    const(value: any): ConstantExpression;
    define(vars?: Record<string, ExpressionValue>, body?: Expression): DefineExpression;
    do(body: Expression, condition?: Expression, breakVariable?: string, maxIterations?: number): DoExpression;
    for(variable: string, start?: ExpressionValue, end?: ExpressionValue, body?: Expression, breakVariable?: string, maxIterations?: number): ForExpression;
    get(...path: ExpressionValue[]): GetExpression;
    if(condition: Expression, body?: Expression, otherwise?: Expression): IfExpression;
    invoke(name: string, args?: Record<string, ExpressionValue>): InvokeExpression;
    not(expr: Expression): NotExpression;
    op<P extends string, O extends string, S extends string>(op: Operation<P, O, S>, params: Record<P, ExpressionValue> & Partial<Record<O, ExpressionValue>>, scopeAlias?: Partial<Record<S, string>>): OperationExpression<P, O, S>;
    or(...exprs: Expression[]): OrExpression;
    return(value?: ExpressionValue): ReturnExpression;
    set(...path: ExpressionValue[]): SetExpression;
    switch<P extends string, O extends string, S extends string>(value: Expression, op: Operation<P, O, S>): SwitchExpression;
    template(template: string, params?: Record<string, ExpressionValue>): TemplateExpression;
    update(...path: ExpressionValue[]): UpdateExpression;
    while(condition: Expression, body?: Expression, breakVariable?: string, maxIterations?: number): WhileExpression;
}