import { Type, TypeMap } from './Type';
import { Expression } from './Expression';
import { Definitions } from './Definitions';
import { Runtime } from './Runtime';
import { DefinitionProvider } from './DefinitionProvider';
import { EventBase } from './EventBase';
import { FunctionType } from './types/Function';
import { FunctionExpression } from './exprs/Function';
export interface FuncOptions {
    name: string;
    created: number;
    updated: number;
    description: string;
    meta: any;
    type: any;
    expression: any;
    defaults: any;
    tests: FuncTest[];
}
export interface FuncTest {
    name: string;
    description: string;
    args: any;
    expected: any;
}
export interface FuncEvents {
    changed(func: Func): void;
    renamed(func: Func, oldName: string): void;
    renameParameter(func: Func, param: string, oldParam: string): void;
    removeParameter(func: Func, param: string): void;
    sync(func: Func, options: FuncOptions, defs: Definitions): void;
    addTest(func: Func, test: FuncTest): void;
    removeTest(func: Func, test: FuncTest): void;
    updateTest(func: Func, test: FuncTest): void;
}
export declare class Func extends EventBase<FuncEvents> implements FuncOptions {
    static create(defs: Definitions, defaults?: Partial<FuncOptions>): Func;
    name: string;
    created: number;
    updated: number;
    description: string;
    meta: any;
    type: FunctionType;
    expression: Expression;
    defaults: any;
    tests: FuncTest[];
    constructor(options: FuncOptions, defs: Definitions);
    protected parseExpression(defs: Definitions, expr: any): FunctionExpression;
    sync(options: FuncOptions, defs: Definitions): void;
    hasChanges(options: FuncOptions): boolean;
    changed(): void;
    encode(): FuncOptions;
    renameParameter(name: string, newName: string): boolean;
    removeParameter(name: string): boolean;
    addTest(test: FuncTest, delayChange?: boolean): void;
    updateTest(test: FuncTest | number, newTest: FuncTest, delayChange?: boolean): boolean;
    removeTest(test: FuncTest | number, delayChange?: boolean): boolean;
    getReturnType(defs: DefinitionProvider, context: Type, paramsTypes?: TypeMap): Type<any, any> | undefined;
    getParamTypes(): TypeMap;
    getParamType(param: string): Type | undefined;
    getArguments(args: any, returnNew?: boolean): any;
    refactor(transform: Expression, runtime: Runtime): void;
    mutates(def: DefinitionProvider, arg: string): boolean;
}
