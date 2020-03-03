import { Type } from './Type';
import { Definitions } from './Definitions';
import { Expression } from './Expression';
import { Runtime } from './Runtime';
import { EventBase } from './EventBase';
export interface ReferenceDataOptions {
    name: string;
    dataType: any;
    data: any;
    meta: any;
}
export interface ReferenceDataEvents {
    changed(data: ReferenceData): void;
    renamed(data: ReferenceData, oldName: string): void;
    sync(data: ReferenceData, options: ReferenceDataOptions, defs: Definitions): void;
}
export declare class ReferenceData extends EventBase<ReferenceDataEvents> implements ReferenceDataOptions {
    static create(defs: Definitions, defaults?: Partial<ReferenceDataOptions>): ReferenceData;
    name: string;
    dataType: Type;
    data: any;
    meta: any;
    constructor(options: ReferenceDataOptions, defs: Definitions);
    sync(options: ReferenceDataOptions, defs: Definitions): void;
    hasChanges(options: ReferenceDataOptions): boolean;
    changed(): void;
    encode(): ReferenceDataOptions;
    refactor(transform: Expression, runtime: Runtime): void;
}
