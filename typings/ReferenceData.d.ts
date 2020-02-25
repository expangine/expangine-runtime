import { Type } from './Type';
import { Definitions } from './Definitions';
import { Expression } from './Expression';
import { Runtime } from './Runtime';
export interface ReferenceDataOptions {
    name: string;
    dataType: any;
    data: any;
    meta: any;
}
export declare class ReferenceData {
    static create(defs: Definitions, defaults?: Partial<ReferenceDataOptions>): ReferenceData;
    name: string;
    dataType: Type;
    data: any;
    meta: any;
    constructor(options: ReferenceDataOptions, defs: Definitions);
    encode(): ReferenceDataOptions;
    refactor(transform: Expression, runtime: Runtime): void;
}
