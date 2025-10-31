import { 
  format as formatG, 
  startOfMonth as startOfMonthG, 
  endOfMonth as endOfMonthG,
  addMonths as addMonthsG, 
  eachDayOfInterval as eachDayOfIntervalG,
  startOfWeek as startOfWeekG,
  endOfWeek as endOfWeekG,
  isSameDay as isSameDayG,
  isSameMonth as isSameMonthG,
  isToday as isTodayG
} from 'date-fns';
import { 
  format as formatJ, 
  startOfMonth as startOfMonthJ, 
  endOfMonth as endOfMonthJ,
  addMonths as addMonthsJ,
  eachDayOfInterval as eachDayOfIntervalJ,
  startOfWeek as startOfWeekJ,
  endOfWeek as endOfWeekJ,
  isSameMonth as isSameMonthJ
} from 'date-fns-jalali';

export type CalendarType = 'gregorian' | 'jalali';

export interface CalendarDay {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  dayNumber: string;
}

// Safe date helper - returns today's date if input is invalid
export const safeDate = (value?: string | Date | null): Date => {
  if (!value) return new Date();
  
  let date: Date;
  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'string') {
    date = new Date(value);
  } else {
    return new Date();
  }
  
  // Check if date is valid
  if (Number.isNaN(date.getTime())) {
    return new Date();
  }
  
  return date;
};

// Safe date parser - can return null for optional dates
export const asDate = (value?: string | Date | null): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

// Get today's date safely
export const getToday = (): Date => {
  return new Date();
};

// Calendar utilities
export function startOfMonth(date: Date, calendar: CalendarType): Date {
  const safeInputDate = safeDate(date);
  try {
    return calendar === 'gregorian' ? startOfMonthG(safeInputDate) : startOfMonthJ(safeInputDate);
  } catch (error) {
    console.warn('Error in startOfMonth:', error);
    return startOfMonthG(new Date());
  }
}

export function endOfMonth(date: Date, calendar: CalendarType): Date {
  const safeInputDate = safeDate(date);
  try {
    return calendar === 'gregorian' ? endOfMonthG(safeInputDate) : endOfMonthJ(safeInputDate);
  } catch (error) {
    console.warn('Error in endOfMonth:', error);
    return endOfMonthG(new Date());
  }
}

export function addMonths(date: Date, amount: number, calendar: CalendarType): Date {
  const safeInputDate = safeDate(date);
  try {
    return calendar === 'gregorian' ? addMonthsG(safeInputDate, amount) : addMonthsJ(safeInputDate, amount);
  } catch (error) {
    console.warn('Error in addMonths:', error);
    return addMonthsG(new Date(), amount);
  }
}

export function formatMonthLabel(date: Date, calendar: CalendarType, lang: 'fa' | 'en'): string {
  const safeInputDate = safeDate(date);
  
  try {
    if (calendar === 'gregorian') {
      return formatG(safeInputDate, 'MMMM yyyy');
    } else {
      return formatJ(safeInputDate, 'MMMM yyyy');
    }
  } catch (error) {
    console.warn('Error formatting month label:', error);
    // Return fallback based on language
    if (lang === 'fa') {
      return 'تقویم';
    } else {
      return 'Calendar';
    }
  }
}

export function isSameDay(dateA: Date | string | null, dateB: Date | string | null): boolean {
  const a = asDate(dateA);
  const b = asDate(dateB);
  if (!a || !b) return false;
  
  try {
    return isSameDayG(a, b);
  } catch (error) {
    console.warn('Error in isSameDay:', error);
    return false;
  }
}

export function isToday(date: Date | string | null): boolean {
  const d = asDate(date);
  if (!d) return false;
  
  try {
    return isTodayG(d);
  } catch (error) {
    console.warn('Error in isToday:', error);
    return false;
  }
}

export function toISO(date: Date | string | null): string | null {
  const d = asDate(date);
  if (!d) return null;
  
  try {
    return d.toISOString();
  } catch (error) {
    console.warn('Error in toISO:', error);
    return null;
  }
}

export function getWeekdayNames(calendar: CalendarType, lang: 'fa' | 'en'): string[] {
  if (calendar === 'gregorian') {
    return lang === 'fa' ? ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'] : ['S','M','T','W','T','F','S'];
  } else {
    return ['ش','ی','د','س','چ','پ','ج'];
  }
}

export function getMonthGrid(baseDate: Date, calendar: CalendarType, weekStartsOn: number = 6): CalendarDay[] {
  const safeBaseDate = safeDate(baseDate);
  
  try {
    const monthStart = startOfMonth(safeBaseDate, calendar);
    const monthEnd = endOfMonth(safeBaseDate, calendar);

    const gridStart = calendar === 'gregorian' 
      ? startOfWeekG(monthStart, { weekStartsOn: weekStartsOn as 0|1|2|3|4|5|6 })
      : startOfWeekJ(monthStart, { weekStartsOn: weekStartsOn as 0|1|2|3|4|5|6 });
      
    const gridEnd = calendar === 'gregorian'
      ? endOfWeekG(monthEnd, { weekStartsOn: weekStartsOn as 0|1|2|3|4|5|6 })
      : endOfWeekJ(monthEnd, { weekStartsOn: weekStartsOn as 0|1|2|3|4|5|6 });

    const days = calendar === 'gregorian'
      ? eachDayOfIntervalG({ start: gridStart, end: gridEnd })
      : eachDayOfIntervalJ({ start: gridStart, end: gridEnd });

    return days.map(date => ({
      date,
      inMonth: calendar === 'gregorian' ? isSameMonthG(date, safeBaseDate) : isSameMonthJ(date, safeBaseDate),
      isToday: isTodayG(date),
      dayNumber: calendar === 'gregorian' ? formatG(date,'d') : formatJ(date,'d')
    }));
  } catch (error) {
    console.warn('Error in getMonthGrid:', error);
    // Return a minimal grid with today's date
    const today = new Date();
    return [{
      date: today,
      inMonth: true,
      isToday: true,
      dayNumber: today.getDate().toString()
    }];
  }
}

export function getMonthNavigation(currentDate: Date, calendar: CalendarType) {
  const safeCurrentDate = safeDate(currentDate);
  
  try {
    const prevMonth = addMonths(safeCurrentDate, -1, calendar);
    const nextMonth = addMonths(safeCurrentDate, 1, calendar);

    return { prevMonth, nextMonth, canGoPrev: true, canGoNext: true };
  } catch (error) {
    console.warn('Error in getMonthNavigation:', error);
    const today = new Date();
    return { 
      prevMonth: new Date(today.getFullYear(), today.getMonth() - 1, 1), 
      nextMonth: new Date(today.getFullYear(), today.getMonth() + 1, 1), 
      canGoPrev: true, 
      canGoNext: true 
    };
  }
}

export function formatDateDisplay(date: Date | string | null, calendar: CalendarType, lang: 'fa' | 'en'): string {
  const d = asDate(date);
  if (!d) return '';
  
  try {
    return calendar === 'gregorian' ? formatG(d,'MMM d, yyyy') : formatJ(d,'MMM d, yyyy');
  } catch (error) {
    console.warn('Error in formatDateDisplay:', error);
    return d.toLocaleDateString();
  }
}

export function getDateKey(date: Date): string {
  const safeInputDate = safeDate(date);
  try {
    return formatG(safeInputDate,'yyyy-MM-dd');
  } catch (error) {
    console.warn('Error in getDateKey:', error);
    return safeInputDate.toISOString().split('T')[0];
  }
}