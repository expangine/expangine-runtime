import { ObjectType, ObjectOptions } from './types/Object';
import { TypeMap } from './Type';
import { Expression } from './Expression';
import { Definitions } from './Definitions';
import { Runtime } from './Runtime';
import { DefinitionProvider } from './DefinitionProvider';
export interface FuncOptions {
    name: string;
    description: string;
    meta: any;
    params: any;
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
export declare class Func {
    static create(defs: Definitions, defaults?: Partial<FuncOptions>): Func;
    name: string;
    description: string;
    meta: any;
    params: ObjectType<ObjectOptions>;
    expression: Expression;
    defaults: any;
    tests: FuncTest[];
    constructor(options: FuncOptions, defs: Definitions);
    encode(): FuncOptions;
    getReturnType(defs: DefinitionProvider, paramsTypes?: TypeMap): import("./Type").Type<any>;
    getParamTypes(): ObjectType;
    getParamType(param: string): import("./Type").Type<any>;
    getArguments(args: any, returnNew?: boolean): any;
    refactor(transform: Expression, runtime: Runtime): void;
}
