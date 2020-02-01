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
  UNSAFE_OPERATION = 1,     // LOW
  POSSIBLY_NULL = 2,        // MEDIUM
  INCOMPATIBLE_TYPES = 3,   // HIGH
  INVALID_EXPRESSION = 4,   // HIGH
  MISSING_FUNCTION = 5,     // HiGH
  MISSING_EXPRESSION = 6,   // HiGH
  MISSING_OPERATION = 7,    // HiGH
}

export interface Validation 
{
  type: ValidationType;
  severity: ValidationSeverity;
  context: Type;
  subject?: Expression;
  parent?: Expression;
  expected?: Type;
  actual?: Type;
}

export type ValidationHandler = (validation: Validation) => void;