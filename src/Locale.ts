
// tslint:disable: no-magic-numbers

export interface LocaleOptions
{

  /**
   * The first day of the week in the locale.
   */
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * The date which determines which day of January decides the first week of 
   * the year. If the first week of the year contains this date it will be the
   * 1st week of the year based on ISO standards. If the first week of the year
   * does not contain this date the weekOfYear will be 0.
   */
  firstWeekContainsDate: 1 | 2 | 3 | 4 | 5 | 6 | 7;

  suffix (value: number): string;

  am: string;
  pm: string;

  formatLT: string;
  formatLTS: string;
  formatL: string;
  formatl: string;
  formatLL: string;
  formatll: string;
  formatLLL: string;
  formatlll: string;
  formatLLLL: string;
  formatllll: string;

  list (items: string[]): string;

  months: [
    [string, string, string, string, string, string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string, string, string, string, string, string]
  ];

  weekdays: [
    [string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string],
    [string, string, string, string, string, string, string]
  ];
}