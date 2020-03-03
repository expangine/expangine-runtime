import { Type } from './Type';
import { Expression } from './Expression';
import { Definitions } from './Definitions';
import { Runtime } from './Runtime';
import { EventBase } from './EventBase';
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
export interface ProgramEvents {
    changed(program: Program): void;
    renamed(program: Program, oldName: string): void;
    sync(program: Program, options: ProgramOptions, defs: Definitions): void;
    addDataset(program: Program, dataset: ProgramDataSet): void;
    removeDataset(program: Program, dataset: ProgramDataSet): void;
    updateDataset(program: Program, dataset: ProgramDataSet): void;
}
export declare class Program extends EventBase<ProgramEvents> implements ProgramOptions {
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
    sync(options: ProgramOptions, defs: Definitions): void;
    hasChanges(options: ProgramOptions): boolean;
    changed(): void;
    encode(): ProgramOptions;
    addDataset(dataset: ProgramDataSet, delayChange?: boolean): void;
    updateDataset(dataset: ProgramDataSet | number, newDataset: ProgramDataSet, delayChange?: boolean): boolean;
    removeDataset(dataset: ProgramDataSet | number, delayChange?: boolean): boolean;
    refactor(transform: Expression, runtime: Runtime): void;
}
