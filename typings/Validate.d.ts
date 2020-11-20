import { Expression } from './Expression';
import { Type } from './Type';
export declare enum ValidationSeverity {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
}
export declare enum ValidationType {
    UNSAFE_OPERATION = 1,
    POSSIBLY_NULL = 2,
    INCOMPATIBLE_TYPES = 3,
    INVALID_EXPRESSION = 4,
    MISSING_FUNCTION = 5,
    MISSING_EXPRESSION = 6,
    MISSING_OPERATION = 7,
    MISSING_TYPE_NAME = 8,
    MISSING_TYPE = 9,
    MISSING_RELATION_NAME = 10,
    MISSING_RELATION = 11,
    MISSING_DATA_NAME = 12,
    MISSING_DATA = 13,
    OUTSIDE_PATH = 14,
    READONLY = 15,
    EMPTY_PATH = 16,
    INVALID_THIS = 17,
    MISSING_METHOD = 18
}
export interface Validation {
    type: ValidationType;
    severity: ValidationSeverity;
    context: Type;
    subject?: Expression | null;
    parent?: Expression | null;
    expected?: Type;
    actual?: Type;
}
export declare type ValidationHandler = (validation: Validation) => void;
