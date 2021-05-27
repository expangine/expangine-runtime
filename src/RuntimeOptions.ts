

/**
 * Options to control how the runtime handles certain scenarios.
 */
export interface RuntimeOptions
{

  /**
   * If `list[index]` expressions should result in an optional type.
   */
  listItemOptional?: boolean;

  /**
   * If `object[text]` expressions should result in an optional type.
   */
  objectPropertyOptional?: boolean;

  /**
   * If `text[index]` expressions should result in an optional text type.
   */
  stringCharacterOptional?: boolean;

  /**
   * If `tuple[index]` expressions should result in an optional type.
   */
  tupleElementOptional?: boolean;

}