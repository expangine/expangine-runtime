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
    MISSING_EXPRESSION = 6
}
export interface Validation {
    type: ValidationType;
    severity: ValidationSeverity;
    context: Type;
    subject?: Expression;
    parent?: Expression;
    expected?: Type;
    actual?: Type;
}
export declare type ValidationHandler = (validation: Validation) => void;
