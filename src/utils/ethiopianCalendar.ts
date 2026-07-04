/**
 * Ethiopian & Gregorian Calendar Conversion Utilities
 * Handles exact conversions using Julian Day Numbers (JDN).
 */

export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

/**
 * Convert Gregorian Date to Julian Day Number
 */
export function gregorianToJD(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = Math.floor(A / 4);
  const C = 2 - A + B;
  const E = Math.floor(365.25 * (y + 4716));
  const F = Math.floor(30.6001 * (m + 1));
  return C + day + E + F - 1524.5;
}

/**
 * Convert Julian Day Number to Ethiopian Date
 */
export function jdToEthiopian(jd: number): EthiopianDate {
  const JDN = Math.floor(jd + 0.5);
  const r = (JDN - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  
  const year = 4 * Math.floor((JDN - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  
  return { year, month, day };
}

/**
 * Convert Ethiopian Date to Julian Day Number
 */
export function ethiopianToJD(year: number, month: number, day: number): number {
  return 1723856 + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
}

/**
 * Convert Julian Day Number to Gregorian Date
 */
export function jdToGregorian(jd: number): GregorianDate {
  const JDN = Math.floor(jd + 0.5);
  let temp = JDN + 68569;
  const n = Math.floor((4 * temp) / 146097);
  temp = temp - Math.floor((146097 * n + 3) / 4);
  let year = Math.floor((4000 * (temp + 1)) / 1461001);
  temp = temp - Math.floor((1461 * year) / 4) + 31;
  let month = Math.floor((80 * temp) / 2447);
  const day = temp - Math.floor((2447 * month) / 80);
  temp = Math.floor(month / 11);
  month = month + 2 - 12 * temp;
  year = 100 * (n - 49) + year + temp;
  
  return { year, month, day };
}

/**
 * High-level helper to convert JS Date to Ethiopian Date
 */
export function toEthiopian(date: Date): EthiopianDate {
  const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return jdToEthiopian(jd);
}

/**
 * High-level helper to convert Ethiopian Date back to JS Date
 */
export function toGregorian(year: number, month: number, day: number): Date {
  const jd = ethiopianToJD(year, month, day);
  const greg = jdToGregorian(jd);
  return new Date(greg.year, greg.month - 1, greg.day);
}

export const AMHARIC_WEEKDAYS = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'];
export const ENGLISH_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ETHIOPIAN_MONTHS = [
  { en: 'Meskerem', am: 'መስከረም' },
  { en: 'Tekemt', am: 'ጥቅምት' },
  { en: 'Hedar', am: 'ህዳር' },
  { en: 'Tahsas', am: 'ታኅሣሥ' },
  { en: 'Ter', am: 'ጥር' },
  { en: 'Yekatit', am: 'የካቲት' },
  { en: 'Megabit', am: 'መጋቢት' },
  { en: 'Miazia', am: 'ሚያዝያ' },
  { en: 'Ginbot', am: 'ግንቦት' },
  { en: 'Sene', am: 'ሰኔ' },
  { en: 'Hamle', am: 'ሐምሌ' },
  { en: 'Nehase', am: 'ነሐሴ' },
  { en: 'Pagume', am: 'ጳጉሜ' }
];

export const GREGORIAN_MONTHS = [
  { en: 'January', am: 'ጃንዋሪ' },
  { en: 'February', am: 'ፌብሩዋሪ' },
  { en: 'March', am: 'ማርች' },
  { en: 'April', am: 'ኤፕሪል' },
  { en: 'May', am: 'ሜይ' },
  { en: 'June', am: 'ጁን' },
  { en: 'July', am: 'ጁላይ' },
  { en: 'August', am: 'ኦገስት' },
  { en: 'September', am: 'ሴፕቴምበር' },
  { en: 'October', am: 'ኦክቶበር' },
  { en: 'November', am: 'ኖቬምበር' },
  { en: 'December', am: 'ዲሴምበር' }
];
