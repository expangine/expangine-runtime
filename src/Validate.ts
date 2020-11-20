import { Expression } from './Expression';
import { Type } from './Type';



export enum ValidationSeverity 
{
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export enum ValidationType 
{
  UNSAFE_OPERATION = 1,       // LOW
  POSSIBLY_NULL = 2,          // MEDIUM
  INCOMPATIBLE_TYPES = 3,     // HIGH
  INVALID_EXPRESSION = 4,     // HIGH
  MISSING_FUNCTION = 5,       // HiGH
  MISSING_EXPRESSION = 6,     // HiGH
  MISSING_OPERATION = 7,      // HiGH
  MISSING_TYPE_NAME = 8,      // HIGH
  MISSING_TYPE = 9,           // HIGH
  MISSING_RELATION_NAME = 10, // HIGH
  MISSING_RELATION = 11,      // HIGH
  MISSING_DATA_NAME = 12,     // HIGH
  MISSING_DATA = 13,          // HIGH
  OUTSIDE_PATH = 14,          // HIGH
  READONLY = 15,              // HIGH
  EMPTY_PATH = 16,            // HIGH
  INVALID_THIS = 17,          // HIGH
  MISSING_METHOD = 18,        // HIGH
}

export interface Validation 
{
  type: ValidationType;
  severity: ValidationSeverity;
  context: Type;
  subject?: Expression | null;
  parent?: Expression | null;
  expected?: Type;
  actual?: Type;
}

export type ValidationHandler = (validation: Validation) => void;
