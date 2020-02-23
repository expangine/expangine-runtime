import { Type } from './Type';
import { Expression } from './Expression';
import { Definitions } from './Definitions';
import { Runtime } from './Runtime';
export interface ProgramOptions {
    name: string;
    author: string;
    description: string;
    meta: any;
    created: number;
    updated: number;
    dataType: any;
    datasets: ProgramDataSet[];
    expression: any;
}
export interface ProgramDataSet {
    name: string;
    data: any;
    created: number;
    updated: number;
    meta: any;
}
export declare class Program {
    static create(defs: Definitions, defaults?: Partial<ProgramOptions>): Program;
    name: string;
    author: string;
    description: string;
    meta: any;
    created: number;
    updated: number;
    dataType: Type;
    datasets: ProgramDataSet[];
    expression: Expression;
    constructor(options: ProgramOptions, defs: Definitions);
    encode(): ProgramOptions;
    refactor(transform: Expression, runtime: Runtime): void;
}
