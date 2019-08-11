
import { LocaleOptions } from '../Locale';



const MAP: string[] = [
  'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'
];


export const en: LocaleOptions = 
{
  weekStartsOn: 0,
  firstWeekContainsDate: 4,

  am: 'am',
  pm: 'pm',

  formatLT: 'h:mm A',
  formatLTS: 'h:mm:ss A',
  formatL: 'MM/DD/Y',
  formatl: 'M/D/Y',
  formatLL: 'MMMM D, Y',
  formatll: 'MMM D, Y',
  formatLLL: 'MMMM D, Y h:mm A',
  formatlll: 'MMM D, Y h:mm A',
  formatLLLL: 'dddd, MMMM D, Y h:mm A',
  formatllll: 'ddd, MMM D, Y h:mm A',

  suffix: (value: number) => 
  {
    const TH_SPECIAL_MIN = 11;
    const TH_SPECIAL_MAX = 13;
    const suffix = value >= TH_SPECIAL_MIN && value <= TH_SPECIAL_MAX ? 'th' : MAP[ value % MAP.length ];

    return value + suffix;
  },

  list: (items) => 
  {
    const last: number = items.length - 1;
    let out: string = items[0];

    for (let i = 1; i < last; i++) 
    {
      out += ', ' + items[i];
    }

    if (last > 0) {
      out += ' and ' + items[last];
    }

    return out;
  },

  months: [
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ['Ja', 'F', 'Mr', 'Ap', 'My', 'Je', 'Jl', 'Ag', 'S', 'O', 'N', 'D']
  ],

  weekdays: [
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'],
  ],

};
